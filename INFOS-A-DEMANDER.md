# Ben Buskila – infos à lui demander

Tout ce qui est marqué « À REMPLIR » dans le code. Où le changer est indiqué entre parenthèses.

## Ce qu'on sait déjà (Instagram @ben_buskila_meats, nov. 2026)

- 11 400 abonnés, 228 publications ; bio : chef privé, événements exclusifs et de luxe, réservations au 052-734-7626.
- Plus de 5 ans d'expérience (légende de 2024).
- Concept « עמדת הבוטיק » (station boutique) : entrées, salades, 8 sortes de viande, plats spéciaux, desserts et table de fruits de saison, glace carbonique.
- Événements cités : Liel Yazamut (ranch de Binyamina), mariage à Havat El Nave, mariage à Moshav Tzrufa, bat-mitsva dans le Carmel, mairie de Kiryat Yam (4e fois), brit, anniversaire au pub HaSifria (Krayot), événement au tombeau de Rabbi Meïr.
- Stories à la une : Brasil, Miami, Limassol, San Andrés, Colombia, New York, Thailand, Mexico, Dubai.
- Logo : toque de chef sur deux couteaux croisés, « BEN BUSKILA · SPECIAL MEATS » (tablier, station). Redessiné en SVG simplifié, sans la tête de mort.

## À demander

1. **Son histoire et son parcours** : formation, restaurants, comment il a commencé, pourquoi la viande (locales → `about`).
2. **Les expériences proposées et leurs prix** : par personne ou forfait, pour la station boutique, le dîner servi, le menu d'été (data/menus.json → `priceFrom`). La masterclass existe-t-elle vraiment ?
3. **Minimum de convives** par expérience (data/menus.json → `minGuests`, FAQ).
4. **Conditions à l'étranger** : billets, logement, matériel, équipe, délai de réservation (FAQ).
5. **Destinations** : a-t-il cuisiné pour des clients dans chacun des 9 pays des stories, ou certaines sont-elles des voyages perso ? (data/destinations.json). Toronto, Cozumel, Isla Mujeres aussi ?
6. **Cacher ou non** : quelle cacherout, avec quelle supervision ? (FAQ)
7. **Équipe et service** : combien de personnes, serveurs inclus ? (FAQ)
8. **Chiffres** : nombre d'événements réalisés et de convives servis (data/stats.json → `events`, `guests`), nombre de convives par réalisation (data/realisations.json → `guests`).
9. **Acompte** : montant et moyen de paiement si on active le paiement en ligne (lib/payment.ts, désactivé).
10. **De vrais avis clients** (prénom, type d'événement, texte, accord pour publier). Aucun n'a été inventé.
11. **Photos et vidéos en bonne qualité** (originaux, pas Instagram), surtout : vidéo horizontale pour le hero desktop, un portrait, des tables dans des villas, des événements à l'étranger. À déposer dans `assets/a-recevoir/`.
12. **Le logo en fichier** (vectoriel si possible) pour remplacer le SVG redessiné (components/Logo.tsx, app/icon.svg).
13. **Le bandeau d'infos** : quelles prochaines dates à l'étranger annoncer (data/annonces.json).
14. **Dates déjà prises** (data/dates.json).
