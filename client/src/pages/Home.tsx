import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const documentTypes = [
    {
      id: "devis",
      title: "Devis",
      description: "Créer un nouveau devis pour un client",
      icon: FileText,
      color: "from-pink-200 to-pink-300",
    },
    {
      id: "bon-commande",
      title: "Bon de Commande",
      description: "Générer un bon de commande",
      icon: ShoppingCart,
      color: "from-blue-200 to-blue-300",
    },
    {
      id: "facture",
      title: "Facture",
      description: "Créer une facture pour un client",
      icon: Receipt,
      color: "from-purple-200 to-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8D5E8] via-white to-[#A8D8EA]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Azoth Agence" className="h-12 w-12 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Azoth Agence</h1>
              <p className="text-sm text-gray-600">Générateur de Documents</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Générateur de Documents Commerciaux
            </h2>
            <p className="text-lg text-gray-700">
              Choisissez le type de document que vous souhaitez créer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {documentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary"
                  onClick={() => setLocation(`/create/${type.id}`)}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription className="text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Créer un {type.title.toLowerCase()}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">À propos</h3>
            <p className="text-gray-700 mb-4">
              Cet outil vous permet de générer facilement des documents commerciaux professionnels 
              pour Azoth Agence. Chaque document est automatiquement formaté avec l'identité visuelle 
              de l'entreprise.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>SIREN:</strong> 928520014
              </div>
              <div>
                <strong>Email:</strong> azothflux@gmail.com
              </div>
              <div>
                <strong>Téléphone:</strong> +33605191745
              </div>
              <div>
                <strong>Adresse:</strong> 396 chemin de Mangepan, 84800 L'isle sur la sorgue
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Azoth Agence - L'alchimie digitale au service de votre croissance</p>
        </div>
      </footer>
    </div>
  );
}

