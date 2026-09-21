import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

interface NotificationEmailProps {
  userName: string;
  transactionRef: string;
  amount: number;
}

export function NotificationEmail({
  userName = "Valued Customer",
  transactionRef = "TX-123456",
  amount = 49.99,
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Transaction Summary</Heading>
          <Text style={textStyle}>Hello {userName},</Text>
          <Text style={textStyle}>
            Your transaction has been processed successfully. Below are the details:
          </Text>
          <Section style={boxStyle}>
            <Text style={detailStyle}>
              <strong>Reference:</strong> {transactionRef}
            </Text>
            <Text style={detailStyle}>
              <strong>Amount Paid:</strong> ${amount.toFixed(2)}
            </Text>
            <Text style={detailStyle}>
              <strong>Status:</strong> Completed
            </Text>
          </Section>
          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            Thank you for your business. If you have any questions, please contact support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default NotificationEmail;

const mainStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily: "sans-serif",
  padding: "20px 0",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  padding: "40px",
  margin: "0 auto",
  maxWidth: "600px",
};

const headingStyle = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const textStyle = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "24px",
};

const boxStyle = {
  backgroundColor: "#f4f6f8",
  borderRadius: "6px",
  padding: "16px",
  margin: "20px 0",
};

const detailStyle = {
  color: "#333333",
  fontSize: "14px",
  margin: "4px 0",
};

const hrStyle = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footerStyle = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
};
