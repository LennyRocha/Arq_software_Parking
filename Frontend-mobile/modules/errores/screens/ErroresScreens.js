import { View } from 'react-native'
import React from 'react'
import BoxStyles from '../../../utils/genericScreenStyles'
import { Text, Button, Icon, useTheme } from 'react-native-paper'

export function NoWifi({ callback }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"wifi-off"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>Error de conexión</Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>Revisa tu conexión a internet y vuelve a intentarlo</Text>
            {
                callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback} >Reintentar</Button>
            }
        </View>
    )
}

export function ErrorTimeout({ callback }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"timer-sand"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>
                Tiempo de espera agotado
            </Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>
                Se agotó el tiempo de espera para realizar la solicitud
            </Text>
            {callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback}>Reintentar</Button>}
        </View>
    );
}

export function ErrorNoConnection({ callback }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"wifi-off"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>
                Sin conexión
            </Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>
                Error de conexión, revisa tu conexión a internet y vuelve a intentarlo
            </Text>
            {callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback}>Reintentar</Button>}
        </View>
    );
}

export function ErrorServer({ callback, message }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"server"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>
                Error del servidor
            </Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>
                {message || "Ocurrió un error en el servidor. Intenta más tarde."}
            </Text>
            {callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback}>Reintentar</Button>}
        </View>
    );
}

export function ErrorNoResponse({ callback }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"cloud-off-outline"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>
                Sin respuesta
            </Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>
                No se recibió respuesta del servidor
            </Text>
            {callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback}>Reintentar</Button>}
        </View>
    );
}

export function ErrorUnknown({ callback, message }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={"alert-circle-outline"} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>
                Error desconocido
            </Text>
            <Text variant='bodyLarge' style={{ textAlign: "center", color: paper.colors.gray }}>
                {message || "Ocurrió un error desconocido"}
            </Text>
            {callback && <Button style={BoxStyles.ButtonRadius} labelStyle={BoxStyles.buttonTextAuto} mode='contained' buttonColor={paper.colors.tertiary} onPress={callback}>Reintentar</Button>}
        </View>
    );
}

export default function ErrorAxios({ error, callback }) {
    if (!error) return null;

    if (error.code === 'ECONNABORTED') return <ErrorTimeout callback={callback} />;

    if (error.message?.toLowerCase().includes('network error')) return <ErrorNoConnection callback={callback} />;

    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || getAxiosErrorMessage(error);

        if ([500, 501, 502, 503, 504].includes(status)) return <ErrorServer callback={callback} message={message} />;

        if ([400, 401, 403, 404].includes(status)) return <ErrorServer callback={callback} message={message} />;

        return <ErrorUnknown callback={callback} message={message} />;
    }

    if (error.request) return <ErrorNoResponse callback={callback} />;

    return <ErrorUnknown callback={callback} message={error.message} />;
}