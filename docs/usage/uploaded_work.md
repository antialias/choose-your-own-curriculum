# Uploaded Work

Authenticated users can upload documents from the **Uploaded Work** page. The server stores the original file, an LLM-generated summary and timestamps for when the work was completed and uploaded. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using SQLite's built-in **VSS** module for fast similarity search.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` in summaries are rendered with KaTeX.
