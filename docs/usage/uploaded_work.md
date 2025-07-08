# Uploaded Work

Authenticated users can upload documents from the **Uploaded Work** page. The server stores the original file, an LLM-generated summary and timestamps for when the work was completed and uploaded. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using **sqlite-vec** for fast similarity search.

Image uploads also generate a 1.5" thumbnail for quick browsing. Thumbnails appear next to each summary and link to the full document, which remains available for download.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` inside summaries are rendered with KaTeX.
