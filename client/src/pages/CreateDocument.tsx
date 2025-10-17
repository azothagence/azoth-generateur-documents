import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateDocument() {
  const { type } = useParams<{ type: string }>();
  const documentType = type as "devis" | "bon-commande" | "facture";

  const [documentNumber, setDocumentNumber] = useState("");
  const [documentDate, setDocumentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [validityDate, setValidityDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const getDocumentTitle = () => {
    switch (documentType) {
      case "devis":
        return "DEVIS";
      case "bon-commande":
        return "BON DE COMMANDE";
      case "facture":
        return "FACTURE";
      default:
        return "DOCUMENT";
    }
  };

  const addLine = () => {
    setLines([...lines, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const calculateSubtotal = () => {
    return lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );
  };

  const calculateDiscount = () => {
    if (!hasDiscount || discountPercentage === 0) return 0;
    return (calculateSubtotal() * discountPercentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Charger et ajouter le logo
    try {
      const logoResponse = await fetch('/logo.jpeg');
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });
      doc.addImage(logoBase64, 'JPEG', 15, 15, 20, 20);
    } catch (e) {
      console.error('Erreur chargement logo:', e);
    }

    // En-tête avec informations entreprise
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("AZOTH AGENCE", 40, 20);
    doc.setFontSize(8);
    doc.text("FERRAGU ELIAS-MILAN", 40, 25);
    doc.text("SIREN: 928520014", 40, 29);
    doc.text("azothflux@gmail.com", 40, 33);
    doc.text("+33605191745", 40, 37);

    // Titre du document
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    
    // Dégradé simulé avec couleurs
    if (documentType === "bon-commande") {
      doc.setTextColor(217, 70, 239);
      doc.text("BON DE", pageWidth - 15, 20, { align: "right" });
      doc.setTextColor(59, 130, 246);
      doc.text("COMMANDE", pageWidth - 15, 30, { align: "right" });
    } else {
      doc.setTextColor(217, 70, 239);
      doc.text(getDocumentTitle(), pageWidth - 15, 25, { align: "right" });
    }

    // Informations document
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    let yPos = 50;
    doc.text(`N° ${documentNumber || "___"}`, 15, yPos);
    doc.text(`Date: ${new Date(documentDate).toLocaleDateString("fr-FR")}`, 60, yPos);
    
    if (documentType === "devis" && validityDate) {
      yPos += 5;
      doc.text(`Valable jusqu'au: ${new Date(validityDate).toLocaleDateString("fr-FR")}`, 15, yPos);
    }

    // Cadres Client et Paiement
    yPos += 10;
    doc.setFillColor(232, 213, 232);
    doc.rect(15, yPos, 85, 30, "F");
    doc.setFillColor(168, 216, 234);
    doc.rect(105, yPos, 90, 30, "F");

    // Client
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("CLIENT", 18, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(clientName || "___", 18, yPos + 10);
    doc.setFontSize(8);
    doc.text(clientAddress || "___", 18, yPos + 15);
    doc.text(clientCity || "___", 18, yPos + 20);

    // Paiement
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("INFORMATIONS DE PAIEMENT", 108, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Conditions: À réception", 108, yPos + 10);
    doc.text("Mode: Virement bancaire", 108, yPos + 15);
    doc.text("Devise: EUR (€)", 108, yPos + 20);

    // Tableau des lignes
    yPos += 40;
    
    // En-tête tableau avec dégradé rose-bleu
    doc.setFillColor(232, 213, 232);
    doc.rect(15, yPos, pageWidth - 30, 8, "F");
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("DESCRIPTION", 18, yPos + 5);
    doc.text("QTÉ", pageWidth - 80, yPos + 5, { align: "right" });
    doc.text("P.U. HT", pageWidth - 50, yPos + 5, { align: "right" });
    doc.text("TOTAL HT", pageWidth - 18, yPos + 5, { align: "right" });

    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // Lignes du tableau
    lines.forEach((line, index) => {
      if (yPos > pageHeight - 60) return; // Éviter débordement
      
      const total = line.quantity * line.unitPrice;
      doc.setTextColor(60, 60, 60);
      doc.text(line.description || "___", 18, yPos + 5);
      doc.text(line.quantity.toString(), pageWidth - 80, yPos + 5, { align: "right" });
      doc.text(`${line.unitPrice.toFixed(2)}€`, pageWidth - 50, yPos + 5, { align: "right" });
      doc.text(`${total.toFixed(2)}€`, pageWidth - 18, yPos + 5, { align: "right" });
      
      yPos += 8;
      if (index < lines.length - 1) {
        doc.setDrawColor(240, 240, 240);
        doc.line(15, yPos, pageWidth - 15, yPos);
      }
    });

    // Totaux
    yPos += 5;
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    // Sous-total
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth - 95, yPos, 80, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Sous-total HT:", pageWidth - 90, yPos + 5);
    doc.text(`${subtotal.toFixed(2)}€`, pageWidth - 18, yPos + 5, { align: "right" });

    // Réduction si applicable
    if (hasDiscount && discount > 0) {
      yPos += 8;
      doc.setFillColor(217, 70, 239, 0.1);
      doc.rect(pageWidth - 95, yPos, 80, 7, "F");
      doc.setTextColor(217, 70, 239);
      doc.text(`Réduction (${discountPercentage}%):`, pageWidth - 90, yPos + 5);
      doc.text(`-${discount.toFixed(2)}€`, pageWidth - 18, yPos + 5, { align: "right" });
    }

    // Total final avec dégradé
    yPos += 8;
    doc.setFillColor(217, 70, 239);
    doc.rect(pageWidth - 95, yPos, 80, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL FINAL HT", pageWidth - 90, yPos + 7);
    doc.text(`${total.toFixed(2)}€`, pageWidth - 18, yPos + 7, { align: "right" });

    // Signature
    yPos += 20;
    if (yPos < pageHeight - 30) {
      doc.setDrawColor(168, 216, 234);
      doc.rect(pageWidth / 2 - 30, yPos, 60, 20);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("BON POUR ACCORD", pageWidth / 2, yPos + 8, { align: "center" });
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("Signature du client", pageWidth / 2, yPos + 13, { align: "center" });
    }

    // Footer
    yPos += 25;
    if (yPos < pageHeight - 15) {
      doc.setFillColor(232, 213, 232, 0.3);
      doc.rect(15, yPos, pageWidth - 30, 12, "F");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("Merci de votre confiance", pageWidth / 2, yPos + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text("L'alchimie digitale au service de votre croissance", pageWidth / 2, yPos + 9, { align: "center" });
    }

    // Télécharger le PDF
    const fileName = `${getDocumentTitle()}_${documentNumber || "sans_numero"}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                {getDocumentTitle()}
              </h1>
              <p className="text-sm text-gray-600">Azoth Agence</p>
            </div>
          </div>
          <Button
            onClick={generatePDF}
            className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-6">
            <Card className="border-2 border-pink-200/50">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50">
                <CardTitle>Informations du document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="docNumber">Numéro</Label>
                    <Input
                      id="docNumber"
                      placeholder="001"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docDate">Date</Label>
                    <Input
                      id="docDate"
                      type="date"
                      value={documentDate}
                      onChange={(e) => setDocumentDate(e.target.value)}
                    />
                  </div>
                </div>
                {documentType === "devis" && (
                  <div>
                    <Label htmlFor="validityDate">Valable jusqu'au</Label>
                    <Input
                      id="validityDate"
                      type="date"
                      value={validityDate}
                      onChange={(e) => setValidityDate(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200/50">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="clientName">Nom du client</Label>
                  <Input
                    id="clientName"
                    placeholder="Nom de l'entreprise"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Adresse</Label>
                  <Input
                    id="clientAddress"
                    placeholder="Rue et numéro"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientCity">Ville</Label>
                  <Input
                    id="clientCity"
                    placeholder="Code postal et ville"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200/50">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <CardTitle>Lignes du document</CardTitle>
                  <Button
                    onClick={addLine}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-dashed border-purple-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-600">
                        Ligne {index + 1}
                      </span>
                      {lines.length > 1 && (
                        <Button
                          onClick={() => removeLine(index)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Description du service ou produit"
                        value={line.description}
                        onChange={(e) =>
                          updateLine(index, "description", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(index, "quantity", parseInt(e.target.value) || 1)
                          }
                        />
                      </div>
                      <div>
                        <Label>Prix unitaire (€ HT)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(index, "unitPrice", parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold text-purple-600">
                      Total: {(line.quantity * line.unitPrice).toFixed(2)}€ HT
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200/50">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle>Totaux et réduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDiscount"
                    checked={hasDiscount}
                    onCheckedChange={(checked) => setHasDiscount(checked as boolean)}
                  />
                  <Label htmlFor="hasDiscount" className="cursor-pointer">
                    Appliquer une réduction
                  </Label>
                </div>
                {hasDiscount && (
                  <div>
                    <Label htmlFor="discount">Pourcentage de réduction (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Ex: 10"
                      value={discountPercentage}
                      onChange={(e) =>
                        setDiscountPercentage(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                )}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total HT:</span>
                    <span className="font-semibold">
                      {calculateSubtotal().toFixed(2)}€
                    </span>
                  </div>
                  {hasDiscount && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-purple-600">
                      <span>Réduction ({discountPercentage}%):</span>
                      <span className="font-semibold">
                        -{calculateDiscount().toFixed(2)}€
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent pt-2 border-t-2">
                    <span>Total final HT:</span>
                    <span>{calculateTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="border-2 border-blue-200/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50">
                <CardTitle>Aperçu du document</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100">
                  {/* En-tête */}
                  <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gradient-to-r from-pink-200 to-blue-200">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.jpeg"
                        alt="Logo"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-sm bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                          AZOTH AGENCE
                        </div>
                        <div className="text-gray-600">FERRAGU ELIAS-MILAN</div>
                        <div className="text-gray-500">SIREN: 928520014</div>
                        <div className="text-gray-500">azothflux@gmail.com</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-2xl font-black bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                        {documentType === "bon-commande" ? (
                          <div className="flex flex-col items-end gap-0">
                            <span>BON</span>
                            <span>DE</span>
                            <span>COMMANDE</span>
                          </div>
                        ) : (
                          getDocumentTitle()
                        )}
                      </h2>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-200/50 to-blue-200/50 rounded-full text-xs font-semibold">
                      N° {documentNumber || "___"}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-200/50 to-blue-200/50 rounded-full text-xs font-semibold">
                      {new Date(documentDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {validityDate && documentType === "devis" && (
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-200/50 to-blue-200/50 rounded-full text-xs font-semibold">
                        Valable jusqu'au{" "}
                        {new Date(validityDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Client et Paiement */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-lg border border-pink-200">
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        CLIENT
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="font-semibold">{clientName || "___"}</div>
                        <div className="text-gray-600">{clientAddress || "___"}</div>
                        <div className="text-gray-600">{clientCity || "___"}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        PAIEMENT
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>Conditions:</strong> À réception
                        </div>
                        <div>
                          <strong>Mode:</strong> Virement
                        </div>
                        <div>
                          <strong>Devise:</strong> EUR (€)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tableau */}
                  <div className="overflow-hidden rounded-lg border border-gray-200 mb-4">
                    <table className="w-full text-xs">
                      <thead className="bg-gradient-to-r from-pink-200 to-blue-200">
                        <tr>
                          <th className="text-left p-2 font-bold">Description</th>
                          <th className="text-right p-2 font-bold">Qté</th>
                          <th className="text-right p-2 font-bold">P.U. HT</th>
                          <th className="text-right p-2 font-bold">Total HT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((line, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="p-2">{line.description || "___"}</td>
                            <td className="text-right p-2">{line.quantity}</td>
                            <td className="text-right p-2">
                              {line.unitPrice.toFixed(2)}€
                            </td>
                            <td className="text-right p-2 font-semibold">
                              {(line.quantity * line.unitPrice).toFixed(2)}€
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 border-t-2">
                          <td colSpan={3} className="text-right p-2 font-semibold">
                            Sous-total HT
                          </td>
                          <td className="text-right p-2 font-bold">
                            {calculateSubtotal().toFixed(2)}€
                          </td>
                        </tr>
                        {hasDiscount && calculateDiscount() > 0 && (
                          <tr className="bg-purple-50">
                            <td
                              colSpan={3}
                              className="text-right p-2 font-semibold text-purple-600"
                            >
                              Réduction ({discountPercentage}%)
                            </td>
                            <td className="text-right p-2 font-bold text-purple-600">
                              -{calculateDiscount().toFixed(2)}€
                            </td>
                          </tr>
                        )}
                        <tr className="bg-gradient-to-r from-pink-500 to-blue-500 text-white">
                          <td
                            colSpan={3}
                            className="text-right p-3 font-bold text-sm"
                          >
                            TOTAL FINAL HT
                          </td>
                          <td className="text-right p-3 font-bold text-sm">
                            {calculateTotal().toFixed(2)}€
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-6 pt-4 border-t border-dashed border-blue-300">
                    <div className="text-xs font-semibold text-gray-600">
                      Merci de votre confiance
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      L'alchimie digitale au service de votre croissance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

