
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Cookie, Settings, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences));
    // Here you would typically also update any tracking scripts based on preferences
    alert('Cookie preferences saved successfully!');
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 1, 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-blue-600" />
                <CardTitle>What Are Cookies?</CardTitle>
              </div>
              <CardDescription>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better user experience by remembering your preferences and analyzing how you use our service.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-green-600" />
                <CardTitle>Cookie Preferences</CardTitle>
              </div>
              <CardDescription>
                Manage your cookie preferences below. Note that disabling certain cookies may affect the functionality of our website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="text-sm text-gray-600">Required for the website to function properly. Cannot be disabled.</p>
                </div>
                <Switch checked={cookiePreferences.essential} disabled />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                  <p className="text-sm text-gray-600">Help us understand how visitors interact with our website.</p>
                </div>
                <Switch 
                  checked={cookiePreferences.analytics} 
                  onCheckedChange={() => handlePreferenceChange('analytics')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounde-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                  <p className="text-sm text-gray-600">Used to track visitors and display relevant advertisements.</p>
                </div>
                <Switch 
                  checked={cookiePreferences.marketing} 
                  onCheckedChange={() => handlePreferenceChange('marketing')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                  <p className="text-sm text-gray-600">Remember your preferences and settings.</p>
                </div>
                <Switch 
                  checked={cookiePreferences.preferences} 
                  onCheckedChange={() => handlePreferenceChange('preferences')}
                />
              </div>

              <Button onClick={savePreferences} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    These cookies are necessary for the website to function and cannot be switched off. They include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Authentication tokens to keep you logged in</li>
                    <li>Security cookies to prevent fraud</li>
                    <li>Session cookies to maintain your preferences</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Help us understand how you use our website so we can improve it:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Google Analytics for usage statistics</li>
                    <li>Performance monitoring cookies</li>
                    <li>A/B testing cookies for feature optimization</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Functional Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Remember your preferences and provide enhanced features:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Language and region preferences</li>
                    <li>Dashboard layout customizations</li>
                    <li>Theme and accessibility settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Intercom:</strong> For customer support chat functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Disabling cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Under the General Data Protection Regulation (GDPR), you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Know what personal data we collect through cookies</li>
                <li>Access your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Delete your personal data</li>
                <li>Object to the processing of your personal data</li>
                <li>Withdraw consent for non-essential cookies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: thepremiumbrand@gmail.com</p>
                <p className="text-gray-600">Subject: Cookie Policy Inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
