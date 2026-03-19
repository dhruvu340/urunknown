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
  verifyUrl: string;
}

export default function VerifyEmail({
  name,
  verifyUrl,
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

            <Text className="mt-4 text-gray-600 text-sm sm:text-base leading-6">
              Hi {name}, please click the button below to verify your email.
            </Text>

            <Button
              href={verifyUrl}
              className="mt-6 inline-block w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-sm sm:text-base"
            >
              Verify Email
            </Button>

            <Text className="text-xs text-gray-400 mt-6 break-words">
              If the button doesn't work, copy and paste this link:
              <br />
              {verifyUrl}
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}