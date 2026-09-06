import bcrypt from 'bcryptjs';
import { db } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seed() {
  console.log('⚡ Initialisation de la base de données CNDS (Turso / LibSQL)...');

  // Read schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Split and execute statements
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await db.execute(statement);
  }
  console.log('✅ Schéma de base de données créé avec succès.');

  // 1. Seed Admin User
  const existingAdmin = await db.execute({
    sql: 'SELECT id FROM admins WHERE username = ?',
    args: ['admin'],
  });

  if (existingAdmin.rows.length === 0) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('CndsBurundi2024!', salt);
    await db.execute({
      sql: `INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      args: ['admin', 'admin@cndsburundi.bi', passwordHash, 'superadmin'],
    });
    console.log('✅ Compte administrateur créé : admin / CndsBurundi2024!');
  }

  // 2. Seed Board Members (Clear & Insert with uploaded local images)
  await db.execute('DELETE FROM board_members');
  const members = [
    {
      name: 'NTIBANTUNGANYA Sylvestre',
      role_fr: 'Président du CNDS',
      role_rn: 'Umukuru wa CNDS',
      college: 'Présidence Indépendante',
      photo: '/images/bureau/sylvestre_ntibantunganya.jpg',
      bio: 'Ancien Président de la République du Burundi, nommé par Décret N° 238 du 12 octobre 2021 pour présider et animer les travaux du Conseil en toute indépendance et neutralité.',
      order: 1,
    },
    {
      name: 'Céléstin NSAVYIMANA',
      role_fr: 'Vice-président — Travailleurs',
      role_rn: 'Icyegera c\'Umukuru — Abakozi',
      college: 'Travailleurs',
      photo: '/images/bureau/celestin_nsavyimana.jpg',
      bio: 'Représentant élu du collège des syndicats et confédérations des travailleurs pour la défense des droits sociaux et la promotion du travail décent.',
      order: 2,
    },
    {
      name: 'Théodore KAMWENUBUSA',
      role_fr: 'Vice-président — Employeurs',
      role_rn: 'Icyegera c\'Umukuru — Abakoresha',
      college: 'Employeurs',
      photo: '/images/bureau/theodore_kamwenubusa.jpg',
      bio: 'Représentant du patronat et des organisations d\'employeurs (AEB/ANEB) pour la compétitivité économique et la stabilité en entreprise.',
      order: 3,
    },
    {
      name: 'Emmanuel Ngomirakiza',
      role_fr: 'Représentant du gouvernement',
      role_rn: 'Uwaserukiye Leta',
      college: 'Gouvernement',
      photo: '/images/bureau/emmanuel_ngomirakiza.jpg',
      bio: 'Haut cadre représentant l\'État et les ministères de tutelle pour l\'harmonisation des politiques publiques du travail et de la fonction publique.',
      order: 4,
    },
  ];

  for (const m of members) {
    await db.execute({
      sql: `INSERT INTO board_members (full_name, role_title_fr, role_title_rn, college, photo_url, bio_fr, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [m.name, m.role_fr, m.role_rn, m.college, m.photo, m.bio, m.order],
    });
  }
  console.log('✅ Membres du Bureau Exécutif insérés avec photos officielles.');

  // 3. Seed Legal Texts
  const existingTexts = await db.execute('SELECT COUNT(*) as count FROM legal_texts');
  if (existingTexts.rows[0].count === 0) {
    const texts = [
      {
        number: 'Charte 2011',
        category: 'Charte',
        title_fr: 'Charte Nationale de Dialogue Social du Burundi',
        title_rn: 'Amasezerano Nshingiro y\'Ibiganiro mu Bakozi mu Burundi',
        date: '2011-05-25',
        summary_fr: 'Document de consensus tripartite signé à Gitega par le Gouvernement, l\'Association des Employeurs du Burundi (AEB) et les confédérations syndicales (COSYBU & CSB).',
        summary_rn: 'Amasezerano yashyizweko umukono i Gitega n\'inzego zitatu z\'ingenzi.',
        size: '1.4 MB',
      },
      {
        number: 'Décret N° 100/132',
        category: 'Décret',
        title_fr: 'Décret N° 100/132 du 21 mai 2013 portant révision du Décret N° 100/47',
        title_rn: 'Itegeko N° 100/132 ryo ku wa 21 Rusama 2013 rihindura iryashizeho CNDS',
        date: '2013-05-21',
        summary_fr: 'Texte fondateur révisé fixant la mission, la structure tripartite, l\'autonomie de gestion et le cadre de fonctionnement permanent du CNDS.',
        summary_rn: 'Itegeko rikomeza ubwigenge n\'imikorere bya CNDS mu Burundi.',
        size: '2.1 MB',
      },
      {
        number: 'Décret N° 100/47',
        category: 'Décret',
        title_fr: 'Décret N° 100/47 du 9 février 2012 portant création, composition et fonctionnement du CNDS',
        title_rn: 'Itegeko N° 100/47 ryo ku wa 9 Ruhuhuma 2012 rishyiraho CNDS',
        date: '2012-02-09',
        summary_fr: 'Décret initial instituant le Comité National de Dialogue Social au Burundi conformément aux orientations de la Charte de 2011.',
        summary_rn: 'Itegeko rya mbere ryashyizeho inzego z\'uburongozi bwa CNDS.',
        size: '1.8 MB',
      },
      {
        number: 'Décret N° 238',
        category: 'Nomination',
        title_fr: 'Décret N° 238 du 12 octobre 2021 portant nomination du Président du CNDS',
        title_rn: 'Itegeko N° 238 ryo ku wa 12 Gitugutu 2021 rigena Umukuru wa CNDS',
        date: '2021-10-12',
        summary_fr: 'Nomination par Son Excellence Monsieur le Président de la République du Président indépendant du CNDS, S.E. NTIBANTUNGANYA Sylvestre.',
        summary_rn: 'Itegeko ry\'Umukuru w\'Igihugu rigena S.E. NTIBANTUNGANYA Sylvestre.',
        size: '850 KB',
      },
      {
        number: 'Décret N° 239',
        category: 'Nomination',
        title_fr: 'Décret N° 239 du 12 octobre 2021 portant nomination des membres du CNDS',
        title_rn: 'Itegeko N° 239 ryo ku wa 12 Gitugutu 2021 rigena abagize CNDS',
        date: '2021-10-12',
        summary_fr: 'Nomination des 21 membres titulaires et 21 suppléants représentant les trois collèges (Gouvernement, Employeurs, Travailleurs) de la mandature actuelle.',
        summary_rn: 'Itegeko rigena abagize inzego 3 za CNDS.',
        size: '1.2 MB',
      },
    ];

    for (const t of texts) {
      await db.execute({
        sql: `INSERT INTO legal_texts (decree_number, category, title_fr, title_rn, date_promulgated, summary_fr, summary_rn, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [t.number, t.category, t.title_fr, t.title_rn, t.date, t.summary_fr, t.summary_rn, t.size],
      });
    }
    console.log('✅ Textes juridiques insérés.');
  }

  // 4. Seed Official News
  const existingNews = await db.execute('SELECT COUNT(*) as count FROM news');
  if (existingNews.rows[0].count === 0) {
    const newsList = [
      {
        slug: 'vulgarisation-de-la-charte-nationale-de-dialogue-social',
        title_fr: 'Vulgarisation de la Charte Nationale de Dialogue Social',
        title_rn: 'Kumenyekanisha Amasezerano Nshingiro y\'Ibiganiro mu Bakozi',
        summary_fr: 'Campagne de sensibilisation auprès des comités provinciaux et communaux de dialogue social.',
        summary_rn: 'Kumenyekanisha amasezerano nshingiro mu nzego z\'intara n\'amakomine.',
        content_fr: `
          <p>La Charte Nationale de Dialogue Social, signée à Gitega le 25 mai 2011 entre le Gouvernement du Burundi, l'Association des Employeurs du Burundi (AEB) et les organisations syndicales de travailleurs (COSYBU et CSB), demeure la pierre angulaire des relations professionnelles en République du Burundi.</p>
          <p>Cette charte nationale apporte une innovation institutionnelle de taille en préconisant la création d'un organe permanent, autonome et tripartite : le Comité National de Dialogue Social (CNDS).</p>
        `,
        category: 'Dialogue Social',
        image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
        published_at: '2024-09-15 10:00:00',
      },
      {
        slug: 'le-6eme-seminaire-regional-de-linternationale-francophone',
        title_fr: '6ème Séminaire régional de l\'Internationale Francophone de Dialogue Social',
        title_rn: 'Inama Nteguro Mpuzamakungu y\'Ibiganiro mu Bakozi Bakoresha Igifaransa',
        summary_fr: 'Le CNDS a pris part aux échanges régionaux sur les mécanismes de dialogue social.',
        summary_rn: 'CNDS yitavye ibiganiro byo mu karere ku bijanye n\'imibano myiza mu kazi.',
        content_fr: `
          <p>Les délégués des institutions nationales de dialogue social des pays francophones d'Afrique et d'Europe se sont réunis pour débattre des nouveaux défis du monde du travail : digitalisation, transition écologique et protection sociale universelle.</p>
        `,
        category: 'Coopération',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        published_at: '2024-09-08 09:30:00',
      },
      {
        slug: 'renforcement-des-capacites-comites-provinciaux-gitega-karusi',
        title_fr: 'Atelier de renforcement des capacités des CPDS et CCDS',
        title_rn: 'Uruhande rw\'Inyigisho ku Bakorera mu Nzego z\'Intara n\'Amakomine',
        summary_fr: 'Formation des membres des comités provinciaux et communaux de dialogue social.',
        summary_rn: 'Inyigisho zahawe abagize inzego za CNDS mu ntara n\'amakomine.',
        content_fr: `
          <p>Dans le cadre de la décentralisation de la conciliation sociale, un atelier pratique de trois jours a réuni les autorités provinciales, les inspecteurs du travail, les représentants syndicaux et patronaux des provinces de Gitega et Karusi.</p>
        `,
        category: 'Ateliers',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        published_at: '2024-08-28 14:00:00',
      },
    ];

    for (const n of newsList) {
      await db.execute({
        sql: `INSERT INTO news (slug, title_fr, title_rn, summary_fr, summary_rn, content_fr, category, image_url, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [n.slug, n.title_fr, n.title_rn, n.summary_fr, n.summary_rn, n.content_fr, n.category, n.image, n.published_at],
      });
    }
    console.log('✅ Actualités officielles insérées.');
  }

  // 5. Seed Partners
  const existingPartners = await db.execute('SELECT COUNT(*) as count FROM partners');
  if (existingPartners.rows[0].count === 0) {
    const partners = [
      {
        name: 'Banque Mondiale',
        category: 'Partenaire Multilatéral',
        description_fr: 'Appui aux réformes de gouvernance économique, au renforcement des institutions d\'utilité publique et à l\'amélioration du climat des affaires.',
        website_url: 'https://www.worldbank.org',
        badge: 'Financement & Appui',
        sort_order: 1,
      },
      {
        name: 'PNUD Burundi (UNDP)',
        category: 'Nations Unies',
        description_fr: 'Programme des Nations Unies pour le Développement : soutien à la cohésion sociale, au dialogue démocratique et à la consolidation de la paix.',
        website_url: 'https://www.undp.org/burundi',
        badge: 'Développement Institutionnel',
        sort_order: 2,
      },
      {
        name: 'OIT (Organisation Internationale du Travail)',
        category: 'Nations Unies',
        description_fr: 'Agence spécialisée de l\'ONU pour le monde du travail : promotion des normes internationales, du travail décent et du tripartisme.',
        website_url: 'https://www.ilo.org',
        badge: 'Normes & Expertise',
        sort_order: 3,
      },
      {
        name: 'COSYBU',
        category: 'Partenaire Social — Travailleurs',
        description_fr: 'Confédération des Syndicats du Burundi : mandataire tripartite représentant les travailleurs et les fédérations syndicales au sein du CNDS.',
        website_url: '#',
        badge: 'Collège Travailleurs',
        sort_order: 4,
      },
      {
        name: 'ANEB / AEB',
        category: 'Partenaire Social — Employeurs',
        description_fr: 'Association Nationale des Employeurs du Burundi : représentant légal du patronat burundais et des chefs d\'entreprises au sein du Conseil.',
        website_url: '#',
        badge: 'Collège Employeurs',
        sort_order: 5,
      },
      {
        name: 'VNG International',
        category: 'Coopération Décentralisée',
        description_fr: 'Agence de coopération internationale des municipalités néerlandaises : appui aux comités de dialogue social locaux et gouvernance de proximité.',
        website_url: 'https://www.vng-international.nl',
        badge: 'Décentralisation',
        sort_order: 6,
      },
    ];

    for (const p of partners) {
      await db.execute({
        sql: `INSERT INTO partners (name, category, description_fr, website_url, badge, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [p.name, p.category, p.description_fr, p.website_url, p.badge, p.sort_order],
      });
    }
    console.log('✅ Partenaires insérés.');
  }

  console.log('🎉 Amorçage de la base de données CNDS terminé avec succès !');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Erreur lors du seed:', err);
      process.exit(1);
    });
}
