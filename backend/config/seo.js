/**
 * Default SEO copy per public page (overridable via res.render locals).
 */
module.exports = {
  siteName: 'Mission School',
  defaultDescription:
    'Mission School — quality education, holistic development, and a vibrant learning community. Explore programs, events, news, and admissions.',
  defaultKeywords: 'Mission School, school, education, admissions, events, quality education',

  pages: {
    home: {
      seoDescription:
        'Welcome to Mission School. Discover our programs, upcoming events, photo gallery, notices, and how to apply for admission.',
      seoKeywords: 'Mission School, home, admissions, school events, education'
    },
    about: {
      seoDescription:
        'Learn about Mission School — our mission, values, leadership, and what makes our learning community unique.',
      seoKeywords: 'Mission School, about us, mission, vision, leadership'
    },
    events: {
      seoDescription:
        'View upcoming Mission School events, activities, and important dates on our calendar.',
      seoKeywords: 'Mission School, events, calendar, school activities'
    },
    programs: {
      seoDescription:
        'Explore academic programs, curriculum highlights, and notices from Mission School.',
      seoKeywords: 'Mission School, programs, curriculum, academics'
    },
    gallery: {
      seoDescription:
        'Browse the Mission School photo gallery — campus life, celebrations, and memorable moments.',
      seoKeywords: 'Mission School, gallery, photos, campus'
    },
    blogs: {
      seoDescription:
        'Read news and articles from Mission School — updates, insights, and stories from our community.',
      seoKeywords: 'Mission School, blog, news, articles'
    },
    contact: {
      seoDescription:
        'Contact Mission School for admissions, general enquiries, and campus information.',
      seoKeywords: 'Mission School, contact, address, phone, admissions enquiry'
    },
    unesco: {
      seoDescription:
        "Mission School and UNESCO's Happy Schools Initiative — wellbeing, learning, and positive school culture.",
      seoKeywords: 'Mission School, UNESCO, Happy Schools, wellbeing, education'
    },
    quality: {
      seoDescription:
        'Quality education at Mission School — our approach, outcomes, and what families say about us.',
      seoKeywords: 'Mission School, quality education, learning outcomes, testimonials'
    },
    error: {
      seoDescription: 'The page you requested could not be found.',
      seoKeywords: ''
    }
  }
};
