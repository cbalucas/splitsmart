// src/screens/ExpenseSummaryScreen.js
import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { EventContext } from '../context/EventContext';
import commonStyles from '../styles/commonStyles';
import colors from '../styles/colors';

// Función para formatear montos con separador de miles
const formatCurrency = (amount) => {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function ExpenseSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  const {
    events,
    getParticipantsForEvent,
    getGastosForEvent,
    getParticipantById,
    relations,
  } = useContext(EventContext);

  // Estados para controlar las secciones desplegables
  const [showGastos, setShowGastos] = useState(false);
  const [showGastosPorPersona, setShowGastosPorPersona] = useState(false);

  // Obtenemos los datos necesarios
  const event = events.find(e => e.id === eventId);
  const participants = getParticipantsForEvent(eventId);
  const gastos = getGastosForEvent(eventId);

  // Estado para el contenido compartible
  const [shareContent, setShareContent] = useState('');

  // Función para obtener el monto numérico de un gasto
  const getMonto = useCallback((monto) => {
    if (typeof monto === 'string') {
      return parseFloat(monto.replace(',', '.')) || 0;
    }
    return isNaN(monto) ? 0 : monto;
  }, []);

  // Usamos useMemo para calcular todos los datos derivados
  const {
    totalGastos,
    gastosPorParticipante,
    pagos,
    promedioPorParticipante
  } = useMemo(() => {
    // Calcular el total de gastos del evento
    const total = gastos.reduce((acc, gasto) => {
      return acc + getMonto(gasto.monto);
    }, 0);
    
    // Calcular cuánto gastó cada participante
    const gastosMap = {};
    
    // Inicializar el mapa con 0 para cada participante
    participants.forEach(participant => {
      gastosMap[participant.id] = 0;
    });
    
    // Sumar los gastos de cada participante
    gastos.forEach(gasto => {
      const relacion = relations.find(r => r.id === gasto.eventsParticipantsId);
      if (relacion) {
        const participantId = relacion.participantsId;
        const montoNumerico = getMonto(gasto.monto);
        
        // Sumar al total del participante
        gastosMap[participantId] = (gastosMap[participantId] || 0) + montoNumerico;
      }
    });
    
    // Calcular el promedio que debería pagar cada participante
    const promedioPorParticipante = participants.length > 0 ? total / participants.length : 0;
    
    // Calcular los saldos (cuánto debe/recibe cada participante)
    const saldos = [];
    participants.forEach(participant => {
      const gastado = gastosMap[participant.id] || 0;
      const saldo = gastado - promedioPorParticipante;
      saldos.push({
        participantId: participant.id,
        nombre: participant.name,
        saldo: saldo // positivo = recibe dinero, negativo = debe dinero
      });
    });
    
    // Ordenar por saldo (de mayor a menor)
    saldos.sort((a, b) => b.saldo - a.saldo);
    
    // Calcular los pagos necesarios
    const calculatedPagos = [];
    
    // Copia de los saldos para modificarla
    const saldosCopia = [...saldos];
    
    // Mientras haya saldos positivos y negativos significativos
    while (saldosCopia.length > 1) {
      // Ordenar de nuevo (importante para cada iteración)
      saldosCopia.sort((a, b) => b.saldo - a.saldo);
      
      // Si todos los saldos están muy cerca de cero, terminamos
      if (Math.abs(saldosCopia[0].saldo) < 0.01 && Math.abs(saldosCopia[saldosCopia.length - 1].saldo) < 0.01) {
        break;
      }
      
      // El que más recibe (saldo positivo más alto)
      const receptor = saldosCopia[0];
      // El que más debe (saldo negativo más bajo)
      const pagador = saldosCopia[saldosCopia.length - 1];
      
      // Si alguno de los dos tiene saldo cercano a cero, eliminar y continuar
      if (Math.abs(receptor.saldo) < 0.01) {
        saldosCopia.shift();
        continue;
      }
      if (Math.abs(pagador.saldo) < 0.01) {
        saldosCopia.pop();
        continue;
      }
      
      // Monto a transferir (el mínimo entre lo que recibe uno y lo que debe el otro)
      const montoTransferencia = Math.min(receptor.saldo, Math.abs(pagador.saldo));
      
      if (montoTransferencia > 0.01) { // Solo agregar pagos significativos
        calculatedPagos.push({
          de: pagador.participantId,
          deNombre: pagador.nombre,
          para: receptor.participantId,
          paraNombre: receptor.nombre,
          monto: montoTransferencia.toFixed(2)
        });
      }
      
      // Actualizar saldos
      receptor.saldo -= montoTransferencia;
      pagador.saldo += montoTransferencia;
      
      // Eliminar participantes con saldo cercano a cero
      if (Math.abs(receptor.saldo) < 0.01) {
        const index = saldosCopia.indexOf(receptor);
        if (index > -1) saldosCopia.splice(index, 1);
      }
      if (Math.abs(pagador.saldo) < 0.01) {
        const index = saldosCopia.indexOf(pagador);
        if (index > -1) saldosCopia.splice(index, 1);
      }
    }
    
    return {
      totalGastos: total,
      gastosPorParticipante: gastosMap,
      pagos: calculatedPagos,
      promedioPorParticipante
    };
  }, [eventId, gastos, participants, relations, getMonto]);

  // Generar el contenido para compartir una sola vez cuando cambien los datos calculados
  useEffect(() => {
    if (!event) return;
    
    let contenidoCompartir = `RESUMEN DE GASTOS Y PAGOS - ${event?.name || 'Evento'}\n\n`;
    
    // Agregar fecha
    contenidoCompartir += `Fecha: ${event?.date || ''}\n`;
    contenidoCompartir += `Total del evento: $${formatCurrency(totalGastos)}\n`;
    contenidoCompartir += `Gastos c/u: $${formatCurrency(promedioPorParticipante)}\n\n`;
    
    // Agregar gastos individuales
    contenidoCompartir += "GASTOS POR PERSONA:\n";
    participants.forEach(p => {
      const gastado = gastosPorParticipante[p.id] || 0;
      if (gastado > 0) {
        contenidoCompartir += `${p.name}: $${formatCurrency(gastado)}\n`;
      }
    });
    
    contenidoCompartir += "\nPAGOS A REALIZAR:\n";
    if (pagos.length === 0) {
      contenidoCompartir += "No hay pagos pendientes\n";
    } else {
      pagos.forEach(pago => {
        contenidoCompartir += `${pago.deNombre} debe pagar $${formatCurrency(parseFloat(pago.monto))} a ${pago.paraNombre}\n`;
      });
    }
    
    setShareContent(contenidoCompartir);
  }, [event, participants, totalGastos, gastosPorParticipante, pagos, promedioPorParticipante]);

  // Función para compartir el resumen
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: shareContent,
        title: `Resumen de gastos - ${event?.name || 'Evento'}`,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  }, [shareContent, event]);

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RESUMEN DE GASTOS Y PAGOS</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Información del evento */}
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventName}>{event?.name || ''}</Text>
          <Text style={styles.eventDate}>{event?.date || ''}</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total del evento:</Text>
            <Text style={styles.totalAmount}>${formatCurrency(totalGastos)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Gastos c/u:</Text>
            <Text style={styles.totalAmount}>${formatCurrency(promedioPorParticipante)}</Text>
          </View>
        </View>

        {/* Lista de gastos - Desplegable */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setShowGastos(!showGastos)}
          >
            <Text style={styles.sectionTitle}>LISTA DE GASTOS</Text>
            <Ionicons 
              name={showGastos ? "chevron-up-outline" : "chevron-down-outline"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          
          {showGastos && (
            <>
              {gastos.length === 0 ? (
                <Text style={styles.noData}>No hay gastos registrados</Text>
              ) : (
                gastos.map(gasto => {
                  const relacion = relations.find(r => r.id === gasto.eventsParticipantsId);
                  const participante = relacion 
                    ? getParticipantById(relacion.participantsId) 
                    : null;
                  
                  const monto = getMonto(gasto.monto);
                  
                  return (
                    <View key={gasto.id} style={styles.gastoItem}>
                      <View style={styles.gastoDescripcion}>
                        <Text style={styles.gastoTexto}>{gasto.descripcion}</Text>
                        <Text style={styles.gastoPagadoPor}>
                          Pagado por: {participante?.name || 'Desconocido'}
                        </Text>
                      </View>
                      <Text style={styles.gastoMonto}>${formatCurrency(monto)}</Text>
                    </View>
                  );
                })
              )}
            </>
          )}
        </View>

        {/* Gastos por participante - Desplegable */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => setShowGastosPorPersona(!showGastosPorPersona)}
          >
            <Text style={styles.sectionTitle}>GASTOS POR PERSONA</Text>
            <Ionicons 
              name={showGastosPorPersona ? "chevron-up-outline" : "chevron-down-outline"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          
          {showGastosPorPersona && (
            <>
              {participants.length === 0 ? (
                <Text style={styles.noData}>No hay participantes</Text>
              ) : (
                participants
                  // Filtrar participantes con gastos mayores a 0
                  .filter(participante => (gastosPorParticipante[participante.id] || 0) > 0)
                  .map(participante => (
                    <View key={participante.id} style={styles.participanteItem}>
                      <Text style={styles.participanteNombre}>{participante.name}</Text>
                      <Text style={styles.participanteGasto}>
                        ${formatCurrency(gastosPorParticipante[participante.id] || 0)}
                      </Text>
                    </View>
                  ))
              )}
            </>
          )}
        </View>

        {/* Pagos a realizar */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PAGOS A REALIZAR</Text>
          {pagos.length > 0 ? (
            pagos.map((pago, index) => {
              const pagador = getParticipantById(pago.de);
              const receptor = getParticipantById(pago.para);
              
              return (
                <View key={index} style={styles.pagoItem}>
                  <View style={styles.pagoFlexContainer}>
                    <Text style={styles.pagador}>{pagador?.name || pago.deNombre}</Text>
                    <Text style={styles.pagoMonto}>${formatCurrency(parseFloat(pago.monto))}</Text>
                    <Text style={styles.receptor}>{receptor?.name || pago.paraNombre}</Text>
                  </View>
                  {receptor?.aliasCBU && (
                    <Text style={styles.aliasCBU}>Alias: {receptor.aliasCBU}</Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.noPagos}>No hay pagos pendientes</Text>
          )}
        </View>
        
        {/* Espacio adicional al final para que no se corte la última sección */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  shareButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  eventInfoContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  gastoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gastoDescripcion: {
    flex: 1,
    paddingRight: 8,
  },
  gastoTexto: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  gastoPagadoPor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gastoMonto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  participanteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  participanteNombre: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  participanteGasto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  pagoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pagoFlexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagador: {
    fontWeight: 'bold',
    color: colors.error,
    flex: 1,
  },
  receptor: {
    fontWeight: 'bold',
    color: colors.success,
    flex: 1,
    textAlign: 'right',
  },
  pagoMonto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  aliasCBU: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 2,
  },
  noPagos: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: 12,
  },
  noData: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: 12,
  },
  bottomSpace: {
    height: 40, // Espacio adicional al final para evitar que se corte la última sección
  }
});