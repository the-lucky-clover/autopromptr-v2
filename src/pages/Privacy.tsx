
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <CardTitle>Our Commitment to Privacy</CardTitle>
              </div>
              <CardDescription>
                At AutoPromptr, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Name and email address when you create an account</li>
                  <li>Payment information for subscription services</li>
                  <li>Profile information you choose to provide</li>
                  <li>Communication preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Prompts and templates you create or use</li>
                  <li>Platform interactions and usage patterns</li>
                  <li>Performance metrics and analytics data</li>
                  <li>Device information and browser details</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-green-600" />
                <CardTitle>How We Use Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide and improve our AI prompt engineering services</li>
                <li>Process payments and manage your subscription</li>
                <li>Send important updates and notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Provide customer support and technical assistance</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-600" />
                <CardTitle>Data Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure servers with regular security updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Regular security audits and monitoring</li>
                <li>GDPR and CCPA compliance measures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-orange-600" />
                <CardTitle>Data Sharing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We do not sell your personal information. We may share your data only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>With service providers who help us operate our platform</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights or the safety of our users</li>
                <li>In connection with a business transaction (merger, acquisition)</li>
                <li>With your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Under GDPR and other privacy laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Port your data to another service</li>
                <li>Restrict processing of your data</li>
                <li>Object to certain data processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: thepremiumbrand@gmail.com</p>
                <p className="text-gray-600">Subject: Privacy Policy Inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
