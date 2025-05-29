
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Eye } from "lucide-react";

const Templates = () => {
  const templates = [
    {
      title: "Marketing Copy Generator",
      description: "Create compelling marketing copy that converts. Perfect for ads, emails, and landing pages.",
      category: "Marketing",
      rating: 4.9,
      downloads: "12.5K",
      preview: "Write a compelling product description for [PRODUCT] that highlights [BENEFITS] and addresses [PAIN_POINTS]..."
    },
    {
      title: "Code Documentation Assistant",
      description: "Generate comprehensive documentation for your code projects with proper formatting.",
      category: "Development",
      rating: 4.8,
      downloads: "8.2K",
      preview: "Create detailed documentation for the following code: [CODE]. Include purpose, parameters, return values..."
    },
    {
      title: "Creative Story Builder",
      description: "Craft engaging narratives with rich character development and plot structure.",
      category: "Creative",
      rating: 4.9,
      downloads: "15.3K",
      preview: "Write a [GENRE] story about [CHARACTER] who must overcome [CHALLENGE] to achieve [GOAL]..."
    },
    {
      title: "Business Strategy Advisor",
      description: "Get strategic business insights and actionable recommendations for growth.",
      category: "Business",
      rating: 4.7,
      downloads: "6.8K",
      preview: "Analyze the business strategy for [COMPANY] in [INDUSTRY] and provide recommendations for [OBJECTIVE]..."
    },
    {
      title: "Academic Research Helper",
      description: "Structure academic papers and research with proper methodology and citations.",
      category: "Education",
      rating: 4.8,
      downloads: "9.1K",
      preview: "Help me structure a research paper on [TOPIC] with proper methodology, literature review, and analysis..."
    },
    {
      title: "Social Media Content Creator",
      description: "Generate engaging social media posts optimized for different platforms.",
      category: "Marketing",
      rating: 4.9,
      downloads: "18.7K",
      preview: "Create a [PLATFORM] post about [TOPIC] that's engaging, includes relevant hashtags, and encourages [ACTION]..."
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Marketing: "bg-red-100 text-red-800",
      Development: "bg-blue-100 text-blue-800",
      Creative: "bg-purple-100 text-purple-800",
      Business: "bg-green-100 text-green-800",
      Education: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Prompt Templates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professionally crafted prompts that deliver exceptional results across various use cases
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {template.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {template.description}
                </CardDescription>
                
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 italic">
                    "{template.preview}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Download className="w-4 h-4" />
                    {template.downloads} downloads
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Download className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full">
            Browse All Templates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Templates;
