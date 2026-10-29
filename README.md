# Moji zadaci

Aplikacija na srpskom jeziku, napravljena u HTML-u, CSS-u i JavaScript-u, bez dodatnih biblioteka.

## Pokretanje

Otvori ovaj folder u File Explorer-u i dvaput klikni na index.html. Nisu potrebni server, instalacija niti internet veza. Ako je aplikacija već otvorena, osveži stranicu (Ctrl+R).

## Funkcionalnosti

- Dodavanje zadataka klikom na „+ Dodaj” ili tasterom Enter.
- Izbor visokog, srednjeg ili niskog prioriteta i opcionog datuma završetka.
- Označavanje završenih zadataka i vraćanje u nezavršeno stanje.
- Brisanje pojedinačnih zadataka.
- Pretraga naziva bez razlikovanja velikih i malih slova; pretraga prihvata i slova bez kvačica.
- Kombinovanje filtera statusa, prioriteta i roka (danas, prekoračen ili bez roka).
- Dugme za poništavanje pretrage i filtera.
- Pregled ukupnih, nezavršenih i završenih zadataka; prilagođen izgled za mobilne ekrane.

Prekoračen rok označava nezavršen zadatak sa datumom pre današnjeg dana. Rok se računa prema lokalnom datumu uređaja.

## Čuvanje

Svaki zadatak, status, prioritet i rok čuvaju se u localStorage-u pri dodavanju, završavanju i brisanju. Nakon zatvaranja i ponovnog otvaranja browsera ostaju dostupni. Stari zadaci automatski dobijaju srednji prioritet i nemaju rok. Pretraga i filteri se resetuju pri ponovnom otvaranju.

Koristi isti browser, profil i istu lokaciju fajla. Brisanje podataka browsera uklanja zadatke; privatni režim ili zabrana lokalnog skladišta mogu onemogućiti trajno čuvanje. Aplikacija prikazuje poruku ako upis ne uspe.

## Fajlovi i provera

- index.html — struktura i kontrole
- style.css — responzivni dizajn
- script.js — funkcionalnosti i lokalno čuvanje
- tests.cjs — funkcionalne provere sa simuliranim DOM-om i lokalnim skladištem; pokretanje: node tests.cjs (ako je Node.js instaliran)

Automatizovane provere pokrivaju migraciju, dodavanje, prioritete, datume, kombinovanje filtera, pretragu, završavanje, brisanje, ponovno učitavanje, neispravne podatke i neuspeh čuvanja. Prošle su u ugrađenom JavaScript okruženju. Vizuelna provera u browseru nije izvršena: ugrađeni browser blokira lokalne file URL-ove.

## Svetla i tamna tema

Dugme u gornjem desnom uglu prebacuje svetlu i tamnu temu. Početna tema je svetla. Izbor se čuva odvojeno od zadataka u localStorage-u i učitava pre prikaza stranice. Ako browser blokira čuvanje, tema se i dalje menja za tekuću stranicu, a aplikacija prikazuje poruku.

Provere teme: node theme-tests.cjs. Provereni su oba smera prebacivanja, ponovno učitavanje sačuvanog izbora, pristupačne oznake, neispravan izbor, blokirano skladište i očuvanje zadataka u simuliranom DOM okruženju.
