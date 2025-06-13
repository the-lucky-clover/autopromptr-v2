
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, Scale, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <CardTitle>Agreement to Terms</CardTitle>
              </div>
              <CardDescription>
                By accessing and using AutoPromptr, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                AutoPromptr provides AI prompt engineering services, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Premium prompt templates and libraries</li>
                <li>Batch processing and automation tools</li>
                <li>Platform integrations for AI coding environments</li>
                <li>Analytics and performance tracking</li>
                <li>Educational content and courses</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Account Creation</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>One account per person or organization</li>
                <li>You must be at least 18 years old</li>
              </ul>
              
              <h3 className="font-semibold mt-4">Acceptable Use</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Use the service for lawful purposes only</li>
                <li>Respect intellectual property rights</li>
                <li>Do not share account credentials</li>
                <li>Do not attempt to reverse engineer or hack the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <CardTitle>Subscription and Billing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Subscription Plans</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Free tier with limited features</li>
                <li>Paid subscriptions with enhanced capabilities</li>
                <li>Enterprise plans with custom pricing</li>
              </ul>
              
              <h3 className="font-semibold mt-4">Billing Terms</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>Payments are processed securely through Stripe</li>
                <li>14-day money-back guarantee for new subscriptions</li>
                <li>No refunds for partial months of service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Our Content</h3>
              <p className="text-gray-600">
                All content, features, and functionality of AutoPromptr are owned by us and protected by copyright, trademark, and other intellectual property laws.
              </p>
              
              <h3 className="font-semibold mt-4">Your Content</h3>
              <p className="text-gray-600">
                You retain ownership of prompts and content you create. By using our service, you grant us a license to process and store your content to provide the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <CardTitle>Prohibited Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">The following activities are strictly prohibited:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Transmitting malware or harmful code</li>
                <li>Attempting to gain unauthorized access</li>
                <li>Creating fake accounts or impersonating others</li>
                <li>Spamming or sending unsolicited communications</li>
                <li>Using the service for illegal or harmful purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-purple-600" />
                <CardTitle>Limitation of Liability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                To the maximum extent permitted by law, AutoPromptr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
              </p>
              <p className="text-gray-600">
                Our total liability for any claims arising from your use of the service shall not exceed the amount you paid for the service in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-600">
                You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: thepremiumbrand@gmail.com</p>
                <p className="text-gray-600">Subject: Terms of Service Inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
