import { CreditCardView } from 'react-native-credit-card-input';
import { TouchableRipple } from 'react-native-paper';
import React from 'react'

export default function CreditCard({ colorIndex }) {
    const [itemFocused, setItemFocused] = React.useState("number");
    const cardImages = {
        1: require("../../../img/cards/Card_back_1.png"),
        2: require("../../../img/cards/Card_back_2.png"),
        3: require("../../../img/cards/Card_back_3.png"),
        4: require("../../../img/cards/Card_back_4.png"),
        5: require("../../../img/cards/Card_back_5.png"),
    };

    return (
        <TouchableRipple
            style={{ borderRadius: 10, overflow: "hidden", width: 300 }}
            onPress={() =>
                setItemFocused((item) => (item === "number" ? "cvc" : "number"))
            }
        >
            <CreditCardView
                name="Juan Peréz"
                cvc="123"
                expiry="09/28"
                number="**** **** **** 4321"
                type="visa"
                imageFront={cardImages[colorIndex]}
                imageBack={cardImages[colorIndex]}
                style={{ flex: 1 }}
                focusedField={itemFocused}
            />
        </TouchableRipple>
    )
}