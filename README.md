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

## Objavljivanje preko GitHub Pages

Aplikacija je statična: index.html je u glavnom folderu, a style.css, script.js i theme.js koriste relativne putanje. Nisu potrebni backend, instaliranje paketa, build niti API ključevi. Prazan fajl .nojekyll isključuje obradu preko Jekyll-a.

1. Postavi fajlove projekta u GitHub repozitorijum, bez lokalnog .git foldera. Obavezni fajlovi za rad sajta su index.html, style.css, script.js i theme.js; dodaj i .nojekyll (fajl može biti skriven u prikazu foldera).
2. U repozitorijumu otvori Settings → Pages.
3. U odeljku Build and deployment izaberi Source → Deploy from a branch.
4. Izaberi granu u koju su postavljeni fajlovi (na primer main) i folder / (root), pa klikni Save.
5. Sačekaj da GitHub završi objavljivanje i otvori adresu prikazanu u Settings → Pages.

Zvanično uputstvo: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Zadaci i tema ostaju u localStorage-u posetioca; aplikacija ih ne šalje GitHub-u. Podaci sa lokalnog fajla neće se automatski preneti na novu HTTPS adresu. Više projekata na istom GitHub Pages domenu deli isti localStorage; ova aplikacija koristi postojeće ključeve za zadatke i temu.

Provera pripreme: svi referencirani fajlovi postoje, putanje su relativne, JavaScript sintaksa je ispravna i obe grupe funkcionalnih provera prolaze u simuliranom DOM okruženju. Aplikacija nema serverske ili mrežne zavisnosti i može se otvoriti direktno preko index.html. Vizuelna provera u browseru nije izvršena. Projekat je pripremljen lokalno; nije objavljen na GitHub-u.
