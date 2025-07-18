# Uploaded Work

Authenticated users can upload documents or write free text notes from the **Uploaded Work** page. The server stores the original file when provided and asks the LLM to summarize the work. The response may also include an optional grade, extracted student name and date, a required mastery percentage and short feedback. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using **sqlite-vec** for fast similarity search. For PDF uploads the text content is extracted for analysis and the first page is also sent to the LLM as an image.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list. If available, the grade, extracted student name and date, mastery percentage and feedback also display under each summary.

Image uploads generate a thumbnail shown to the left of the summary. The server reads orientation metadata to ensure thumbnails are rotated correctly. PDF uploads are treated the same way—the first page is rasterized and "PDF" is overlaid on top. Thumbnails are sized to at most 1.5 inches on each side while preserving aspect ratio.

If no thumbnail is available or a file type isn't supported, a placeholder icon displays the file's extension instead.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` in summaries are rendered with KaTeX.

Each item has an **Actions** menu where you can delete the work or re-evaluate it. Re-evaluating runs the LLM again and replaces the saved summary and embeddings.
