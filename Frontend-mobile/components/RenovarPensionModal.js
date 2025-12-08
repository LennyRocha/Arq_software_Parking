import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Linking,
    StyleSheet,
} from "react-native";
import {
    Modal,
    Portal,
    Text,
    Button,
    Card,
    ActivityIndicator,
    List,
    Divider,
    useTheme,
    Menu,
    IconButton,
    TextInput,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomAlert } from "../utils/customAlert";
import CustomMultiSteps from './CustomMultiSteps'
import { renovarPensionSchema, renovarPensionInitialValues } from "../modules/pension/config/renovarYup";
import { fetchTiposPension } from "../modules/pension/api/TiposPensionApi";
import { useCustomThemes } from "../context/useCustomColors";
export default function RenovarMiPensionModal({
    visible,
    onDismiss,
    pension,
    onIniciarPago,
    onConfirmarRenovacion,
    setLoading,
}) {
    const theme = useTheme();
    const { mode } = useCustomThemes();
    const [tiposPension, setTiposPension] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(false);
    const [tipoPensionSeleccionado, setTipoPensionSeleccionado] = useState(null);

    // Estados para el flujo de pago
    const [mostrarBotonVerificar, setMostrarBotonVerificar] = useState(false);
    const [procesandoPago, setProcesandoPago] = useState(false);

    // Estados para FAQs
    const [faq1Expanded, setFaq1Expanded] = useState(false);
    const [faq2Expanded, setFaq2Expanded] = useState(false);

    // Estados para alertas
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // Estado para el menú desplegable
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            loadTiposPension();
            setTipoPensionSeleccionado(null);
            setMostrarBotonVerificar(false);
            reset(renovarPensionInitialValues);
        }
    }, [visible]);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: renovarPensionInitialValues,
        resolver: yupResolver(renovarPensionSchema),
        mode: "onChange",
    });

    const tipoPensionId = watch("tipoPensionId");

    const loadTiposPension = async () => {
        setLoadingTipos(true);
        try {
            const response = await fetchTiposPension();
            if (response.data && response.data.data) {
                const tiposActivos = response.data.data.filter((tipo) => tipo.status === true);
                setTiposPension(tiposActivos);
            }
        } catch (error) {
            console.error("Error al cargar tipos de pensión:", error);
            setTiposPension([]);
        } finally {
            setLoadingTipos(false);
        }
    };

    const handleTipoPensionChange = (onChange, tipoPensionId) => {
        onChange(tipoPensionId);
        const tipoSeleccionado = tiposPension.find((tipo) => tipo.id === tipoPensionId);
        setTipoPensionSeleccionado(tipoSeleccionado);
        setMenuVisible(false);
    };

    const calcularFechaFin = () => {
        if (!pension?.fechaInicioProximaRenovacion || !tipoPensionSeleccionado?.duracionDias) {
            return "N/A";
        }

        const fechaInicio = new Date(pension.fechaInicioProximaRenovacion + "T00:00:00");
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + tipoPensionSeleccionado.duracionDias - 1);

        return fechaFin.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatFecha = (fecha) => {
        if (!fecha) return "N/A";
        const date = new Date(fecha + "T00:00:00");
        return date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    // Paso 2: Iniciar pago con Mercado Pago
    const handleIniciarPago = async () => {
        setProcesandoPago(true);

        const resultado = await onIniciarPago(tipoPensionSeleccionado);

        if (resultado.success) {
            // Abrir Mercado Pago en navegador externo
            await Linking.openURL(resultado.initPoint);

            // Mostrar botón de verificar después de 5 segundos
            setTimeout(() => {
                setMostrarBotonVerificar(true);
                setProcesandoPago(false);
            }, 5000);
        } else {
            setProcesandoPago(false);
            showAlert({
                icon: "error",
                title: "Error",
                message: resultado.error,
                confirmText: "Aceptar",
                onConfirm: hideAlert,
                externalDismiss: false,
            });
        }
    };

    // Paso 3: Verificar pago y confirmar renovación
    const handleVerificarPago = async () => {
        showAlert({
            icon: "question",
            title: "Confirmar pago",
            message: "¿Ya completaste el pago en Mercado Pago?",
            confirmText: "Sí, ya pagué",
            cancelText: "Aún no",
            showCancelButton: true,
            onConfirm: async () => {
                // Mostrar loading
                setLoading(true);

                // Confirmar la renovación en el backend
                const resultado = await onConfirmarRenovacion(tipoPensionSeleccionado.id);
                setLoading(false);

                // Resetear el formulario
                reset(renovarPensionInitialValues);
                setTipoPensionSeleccionado(null);
                setMostrarBotonVerificar(false);

                if (resultado) {

                    hideAlert();

                    onDismiss();

                    // Pequeño delay
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    showAlert({
                        icon: "success",
                        title: "¡Éxito!",
                        message: "Pensión renovada correctamente",
                        confirmText: "Aceptar",
                        onConfirm: hideAlert,
                        externalDismiss: false,
                    });
                }

                /* if (resultado.data.success) {
                     showAlert({
                         icon: "success",
                         title: "¡Éxito!",
                         message: "Pensión renovada correctamente",
                         confirmText: "Aceptar",
                         onConfirm: hideAlert,
                         externalDismiss: false,
                     });
                 } else {
                     showAlert({
                         icon: "error",
                         title: "Error",
                         message: resultado.data.message || "Hubo un problema al renovar tu pension, intentalo más tarde",
                         confirmText: "Aceptar",
                         onConfirm: hideAlert,
                         externalDismiss: false,
                     });
                 }*/
            },
            onCancel: hideAlert,
            externalDismiss: true,
        });
    };

    const handleClose = () => {
        reset(renovarPensionInitialValues);
        setTipoPensionSeleccionado(null);
        setMostrarBotonVerificar(false);
        onDismiss();
    };

    const getTipoPensionLabel = (id) => {
        const tipo = tiposPension.find((t) => t.id === id);
        return tipo
            ? `${tipo.nombre} - ${tipo.duracionDias} días - $${tipo.costo} MXN`
            : "Seleccione un tipo de pensión";
    };

    // STEP 1: Seleccionar pensión
    const renderStep1 = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* FAQs */}
            <View style={styles.faqContainer}>
                <List.Accordion
                    title="¿Qué pasa si renuevo antes de que termine?"
                    titleNumberOfLines={2}
                    expanded={faq1Expanded}
                    onPress={() => setFaq1Expanded(!faq1Expanded)}
                    titleStyle={styles.faqTitle}
                >
                    <List.Item
                        description="El nuevo registro tendrá como fecha de inicio el día siguiente al que termina la pensión actual. Se respetan las fechas de cada registro."
                        descriptionNumberOfLines={5}
                    />
                </List.Accordion>

                <List.Accordion
                    title="¿Qué pasa si renuevo cuando ya terminó?"
                    titleNumberOfLines={2}
                    expanded={faq2Expanded}
                    onPress={() => setFaq2Expanded(!faq2Expanded)}
                    titleStyle={styles.faqTitle}
                >
                    <List.Item
                        description="El nuevo registro tendrá fecha de inicio el mismo día en el que se hace el pago."
                        descriptionNumberOfLines={3}
                    />
                </List.Accordion>
            </View>

            {/* Selector de tipo de pensión */}
            <Text style={styles.label}>Selecciona el tipo de pensión *</Text>
            <Controller
                control={control}
                name="tipoPensionId"
                render={({ field: { onChange, value } }) => (
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <TextInput
                                mode="outlined"
                                value={getTipoPensionLabel(value)}
                                editable={false}
                                right={<TextInput.Icon icon="chevron-down" onPress={() => setMenuVisible(true)} />}
                                onPressIn={() => setMenuVisible(true)}
                                error={!!errors.tipoPensionId}
                                disabled={loadingTipos}
                            />
                        }
                    >
                        <ScrollView style={{ maxHeight: 300 }}>
                            {tiposPension.map((tipo) => (
                                <Menu.Item
                                    key={tipo.id}
                                    onPress={() => handleTipoPensionChange(onChange, tipo.id)}
                                    title={`${tipo.nombre} - ${tipo.duracionDias} días`}
                                    titleStyle={{ fontSize: 14 }}
                                    style={{ maxWidth: 400 }}
                                />
                            ))}
                        </ScrollView>
                    </Menu>
                )}
            />

            {errors.tipoPensionId && (
                <Text style={styles.errorText}>{errors.tipoPensionId.message}</Text>
            )}

            {/* Información del período actual */}
            <Card style={styles.infoCard}>
                <Card.Content>
                    <Text variant="bodyMedium">
                        <Text style={styles.bold}>Correo:</Text> {pension?.correo}
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                        <Text style={styles.bold}>La renovación comenzaría el:</Text>{" "}
                        {formatFecha(pension?.fechaInicioProximaRenovacion)}
                    </Text>
                </Card.Content>
            </Card>

            {/* Información de renovación */}
            {tipoPensionSeleccionado && (
                <Card style={[styles.successCard, { borderColor: theme.colors.success, backgroundColor: mode === "dark" ? "#4caf50" : "#e8f5e9" }]}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.bold}>
                            Con la pensión seleccionada, la renovación tendría:
                        </Text>
                        <Divider style={{ marginVertical: 8 }} />
                        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                            <Text style={styles.bold}>Costo:</Text> ${tipoPensionSeleccionado.costo} MXN
                        </Text>
                        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                            <Text style={styles.bold}>Fecha de inicio:</Text>{" "}
                            {formatFecha(pension?.fechaInicioProximaRenovacion)}
                        </Text>
                        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                            <Text style={styles.bold}>Fecha de finalización:</Text> {calcularFechaFin()}
                        </Text>
                    </Card.Content>
                </Card>
            )}
        </ScrollView>
    );

    // STEP 2: Realizar pago
    const renderStep2 = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Resumen de la pensión seleccionada */}
            <Card style={[styles.summaryCard, { borderColor: theme.colors.info, backgroundColor: mode === "dark" ? "#2196f0" : "#e3f2fd" }]}>
                <Card.Content>
                    <Text variant="headlineSmall" style={styles.bold}>
                        Resumen de renovación
                    </Text>
                    <Divider style={{ marginVertical: 12 }} />
                    <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                        <Text style={styles.bold}>Plan:</Text> parKing {tipoPensionSeleccionado?.nombre}
                    </Text>
                    <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                        <Text style={styles.bold}>Duración:</Text> {tipoPensionSeleccionado?.duracionDias}{" "}
                        días
                    </Text>
                    <Text
                        variant="displaySmall"
                        style={{
                            fontWeight: "bold",
                            color: theme.colors.primary,
                            marginTop: 16,
                        }}
                    >
                        ${tipoPensionSeleccionado?.costo} MXN
                    </Text>
                </Card.Content>
            </Card>

            {/* Instrucciones */}
            <Card style={[styles.infoAlert, { borderColor: theme.colors.info, backgroundColor: mode === "dark" ? "#2196f0" : "#e3f2fd" }]}>
                <Card.Content>
                    <Text variant="bodyMedium">
                        💳 Serás redirigido a Mercado Pago. Después de pagar, regresa aquí y haz clic en
                        "Ya pagué".
                    </Text>
                </Card.Content>
            </Card>

            {/* Botón de pago */}
            <Button
                mode="contained"
                onPress={handleIniciarPago}
                disabled={procesandoPago || mostrarBotonVerificar}
                loading={procesandoPago}
                icon="credit-card"
                style={styles.payButton}
                labelStyle={{ fontSize: 16 }}
            >
                {procesandoPago ? "Abriendo Mercado Pago..." : "Proceder al pago"}
            </Button>

            {/* Botón para verificar pago */}
            {mostrarBotonVerificar && (
                <Button
                    mode="outlined"
                    onPress={handleVerificarPago}
                    icon="check-circle"
                    style={[styles.verifyButton, { borderColor: theme.colors.primary }]}
                    labelStyle={{ fontSize: 16, color: theme.colors.primary }}
                >
                    Ya pagué - Completar renovación
                </Button>
            )}

            {/* Métodos de pago */}
            <View style={styles.paymentMethods}>
                <Text variant="bodySmall" style={{ textAlign: "center", marginBottom: 4 }}>
                    Métodos de pago disponibles con Mercado Pago:
                </Text>
                <Text variant="bodySmall" style={{ textAlign: "center" }}>
                    💳 Tarjetas de crédito/débito • 💰 Efectivo • 🏦 Transferencias
                </Text>
            </View>
        </ScrollView>
    );

    // Configuración de los steps
    const steps = [
        {
            label: "Seleccionar",
            content: renderStep1(),
            props: {
                nextBtnDisabled: !tipoPensionSeleccionado || loadingTipos,
            },
        },
        {
            label: "Pagar",
            content: renderStep2(),
            props: {
                finishBtnText: "Cerrar",
            },
            onFinish: handleClose,
        },
    ];

    return (
        <Portal>
            <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end"
                    }}
                >
                    <IconButton
                        size={24}
                        icon="close"
                        onPress={handleClose}
                        iconColor={theme.colors.gray}
                    />
                </View>
                {/* Título */}
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>
                        RENOVAR MI PENSIÓN
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        Selecciona el tipo de pensión deseada y realiza el pago para renovar tu pensión.
                    </Text>
                </View>

                {loadingTipos ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <CustomMultiSteps steps={steps} showButtons={false} />
                )}

                <CustomAlert visible={alertVisible} hideAlert={hideAlert} config={alertConfig} />
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        margin: 10,
        borderRadius: 8,
        maxHeight: "90%",
        flex: 1,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20
    },
    title: {
        fontWeight: "bold",
    },
    faqContainer: {
        marginBottom: 16,
    },
    faqTitle: {
        fontSize: 14,
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
        fontWeight: "500",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
    infoCard: {
        margin: 1,
        marginTop: 16,
    },
    successCard: {
        marginTop: 16,
        borderWidth: 1,
    },
    summaryCard: {
        marginBottom: 16,
        borderWidth: 2,
    },
    infoAlert: {
        marginVertical: 16,
    },
    payButton: {
        marginTop: 16,
    },
    verifyButton: {
        marginTop: 12,
        borderWidth: 2,
    },
    paymentMethods: {
        marginTop: 24,
        alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: "center",
    },
});