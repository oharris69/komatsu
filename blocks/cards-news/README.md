# cards-news

Custom **cards** block. Purpose: article-feed.

## Authoring (Document Authoring)

Model: `standalone`

One row per article: image cell | text cell (`3 min read | Oct 5, 2026` paragraph,
linked heading, bulleted tag list). The meta paragraph is split on `|` into a
read-time (with stopwatch icon) and a date.

## Display rules (match komatsu.com)

- Below 900px every variant shows the first **3** articles as stacked cards
  (1 column, 3 columns from 600px).
- Default (homepage feed), 900px+: masonry grid. Items 1-2 are tall image-overlay
  cards, items 3-5 form a thumbnail list in the fourth column; items 6+ are hidden.
- `related`, 900px+: first **4** articles as equal-width cards.

## Supported variations

| Variation | Option class |
| --- | --- |
| Related articles: equal-width white cards, image above text | `related` |

## Universal Editor fields

N/A (Document Authoring project)
