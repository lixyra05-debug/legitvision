// L'assistant du site ne promet aucun délai de réponse chiffré (décision
// d'Hector du 14/10/2026 : « remplace "Nous répondons sous 24h" par une
// formule sans chiffre ("Nous répondons dès que possible") »).
import { test } from "node:test";
import assert from "node:assert/strict";
import { CHATBOT_RULES, DEFAULT_RESPONSE, matchResponse } from "@/components/chat/chatbot-responses";

const DELAI_CHIFFRE = /\b\d+\s*(?:h|heures?|hours?|jours?|days?|min(?:utes?)?)\b|\bsous\s+\d|\bwithin\s+\d|\bdu lundi au vendredi\b|\bmonday to friday\b/i;

test("assistant : aucune réponse ne promet un délai chiffré", () => {
  const textes = [...CHATBOT_RULES.flatMap((r) => [r.response.fr, r.response.en]), DEFAULT_RESPONSE.fr, DEFAULT_RESPONSE.en];
  assert.ok(textes.length > 10, String(textes.length));
  for (const texte of textes) assert.doesNotMatch(texte, DELAI_CHIFFRE, texte);
});

test("assistant : la réponse « contact » dit « Nous répondons dès que possible »", () => {
  assert.match(matchResponse("contact"), /Nous répondons dès que possible\./);
  assert.match(matchResponse("contact", "en"), /We reply as soon as possible\./);
});
