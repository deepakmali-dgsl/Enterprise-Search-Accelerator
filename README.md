# VFS Enterprise Search Demo

An enterprise search solution demonstrating how to build a modern search experience using **Contentful**, **Algolia**, **Node.js**, and **Next.js**.

The project showcases how a traditional keyword search can be transformed into an intelligent enterprise search experience without introducing AI.

---

## Business Problem

Many enterprise websites store content in a CMS but provide poor search experiences.

Typical issues include:

- Users must open multiple pages before finding answers.
- Visa fee searches return irrelevant results.
- Processing time is hidden inside page content.
- Appointment searches require several clicks.
- Duplicate and unrelated search results.
- Poor relevance ranking.
- No autocomplete or typo tolerance.

---

## Proposed Solution

Use Contentful as the content management system and Algolia as the enterprise search engine.

Content is synchronized automatically through an indexing service.

Users receive instant, highly relevant search results.

---

## Solution Architecture

```

Contentful
│
Webhook
│
▼
Node.js Search API
│
├── Content Sync
├── Search API
├── Business Rules
└── Search Analytics
│
▼
Algolia Search Index
│
▼
Next.js Web Application

```

---

## Technology Stack

| Layer | Technology |
|--------|------------|
| CMS | Contentful |
| Search Engine | Algolia |
| Backend | Node.js + Express |
| Frontend | Next.js |
| API | REST |
| Language | JavaScript |
| Version Control | Git |
| Hosting | Vercel / AWS / Azure |

---

## Features

- Enterprise Search
- Content Synchronization
- Autocomplete
- Typo Tolerance
- Synonyms
- Faceted Search
- Country Filters
- Visa Type Filters
- Featured Results
- Search Snippets
- Search Analytics
- Contentful Webhooks

---

## Example Searches

### Search

```

Estonia Visa Fee

```

Result

```

Estonia Tourist Visa

Visa Fee

₹7200

Processing Time

15 Working Days

Book Appointment

```

---

### Search

```

Book Appointment

```

Result

```

Book Appointment

Reschedule Appointment

```

---

### Search

```

How many days for Estonia Visa?

```

Result

```

Processing Time

15 Working Days

```

---

## Folder Structure

```

backend/
config/
controllers/
routes/
services/
middleware/

frontend/
components/
pages/

docs/

README.md

```

---

## Setup

### Clone

```bash
git clone https://github.com/<username>/vfs-search-demo.git
```

### Backend

```bash
cd backend

npm install
```

### Environment

Create

```
.env
```

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=

ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
ALGOLIA_INDEX_NAME=
```

### Run

```bash
node app.js
```

Server

```
http://localhost:3000
```

---

## API Endpoints

### Health

```
GET /health
```

### Synchronize Content

```
POST /sync
```

### Search

```
GET /search?q=estonia
```

### Contentful Webhook

```
POST /webhook/contentful
```

---

## Roadmap

### Sprint 1

- Project Setup
- Contentful Integration
- Algolia Integration
- REST APIs

### Sprint 2

- Search API
- Search UI
- Filters
- Featured Results

### Sprint 3

- Search Analytics
- Popular Searches
- Failed Searches

### Sprint 4

- AI Search (Optional)

---

## Future Enhancements

- Azure OpenAI
- Semantic Search
- Vector Search
- RAG
- Chat Search
- Search Recommendations

---

## Author

Deepak Mali
Senior Solution Architect
