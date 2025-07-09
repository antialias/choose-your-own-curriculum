# Uploaded Work

Authenticated users can upload documents from the **Uploaded Work** page. The server stores the original file, an LLM-generated summary and timestamps for when the work was completed and uploaded. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using **sqlite-vec** for fast similarity search.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list.

Image uploads also generate a thumbnail shown to the left of the summary. Thumbnails are sized to at most 1.5 inches on each side while preserving aspect ratio.

If no thumbnail is available or a file type isn't supported, a placeholder icon displays the file's extension instead.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` in summaries are rendered with KaTeX.
