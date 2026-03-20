import {
  Html,
  Head,
  Container,
  Text,
  Body,
  Button,
  Heading,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface VerifyEmailProps {
  name: string;
  otp: string;
}

export default function VerifyEmailTemp({
  name,
  otp,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 py-4 px-2">
          <Container className="bg-white w-full max-w-[600px] mx-auto p-6 sm:p-8 rounded-xl text-center">

            <Heading className="text-lg sm:text-xl font-bold">
              Verify your email
            </Heading>
            <br />

            <Text className="mt-4 text-gray-600 text-sm sm:text-base leading-6">
              Hi {name}, please click the button below to verify your email.
            </Text>
            
            <br />

            <Text className="text-xs text-gray-400 mt-6 break-words">
             your otp for verification
              <br />
              {otp}
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}