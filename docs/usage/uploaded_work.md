# Uploaded Work

Authenticated users can upload documents from the **Uploaded Work** page. The server stores the original file, an LLM-generated summary and timestamps for when the work was completed and uploaded. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using **sqlite-vec** for fast similarity search.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list.

When an uploaded file is an image, the server generates a small thumbnail. This thumbnail is displayed to the left of the summary and links to the original document. Thumbnails are sized to fit within a 1.5" square while maintaining the original aspect ratio so nothing is cropped.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` inside summaries are rendered with KaTeX.
