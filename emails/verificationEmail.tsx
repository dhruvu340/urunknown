import {
  Html,
  Head,
  Container,
  Text,
  Body,
  Heading,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface VerifyEmailProps {
  name: string;
  otp: string;
}

export default function VerifyEmailTemp({ name, otp }: VerifyEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 py-4 px-2">
          <Container className="bg-white w-full max-w-[600px] mx-auto p-6 rounded-xl text-center">
            
            <Heading className="text-lg font-bold">
              Verify your email
            </Heading>

            <Text className="mt-4 text-gray-600 text-sm leading-6">
              Hi {name}, your OTP is:
            </Text>

            <Text className="text-lg font-bold mt-4">
              {otp}
            </Text>

            <Text className="text-xs text-gray-400 mt-6">
              This OTP expires in 1 hour.
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}