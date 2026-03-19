import {
    Html,
    Head,
    Container,
    Text,
    Body,
    Button
} from "@react-email/components"

import { Tailwind } from "@react-email/tailwind"

interface verifyEmailProps{
    name:string,
    verifyUrl:string,
}
export default function verifyEmail({
    name,
    verifyUrl,
}:verifyEmailProps){

    return (
        <Html>
            <Tailwind>
            <Head/>
            <Body className="bg-gray py-2">
                <Container className="bg-white max-w-[600px] text-center mx-auto p-8 rounded-xl">
                <Text>
                    Hi, {name} please click on the Button below to verify your email
                </Text>
                <Button href={verifyUrl} className="bg-gray rounded-lg p-3 text-white font-medium text-base">
                    Verify email
                </Button>
                </Container>
            </Body>
            </Tailwind>
        </Html>
    )

}