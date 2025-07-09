# Uploaded Work

Authenticated users can upload documents or write free text notes from the **Uploaded Work** page. The server stores the original file when provided and asks the LLM to summarize the work. The response may also include an optional grade, extracted student name and date, an estimated percentage of topic mastery and short feedback. Embedding vectors are generated with the `multimodal-embedding-3-small` model and indexed using **sqlite-vec** for fast similarity search.

Each upload appears in the list with its summary for easy review. New uploads show a temporary `Processing...` placeholder while the summary is generated. Any errors are shown next to the list.
If available, the grade, extracted student name and date, mastery percentage and feedback also display under each summary.

Image uploads also generate a thumbnail shown to the left of the summary. Thumbnails are sized to at most 1.5 inches on each side while preserving aspect ratio.

If no thumbnail is available or a file type isn't supported, a placeholder icon displays the file's extension instead.

Math expressions wrapped in `$...$`, `$$...$$`, `\(...\)` or `\[...\]` in summaries are rendered with KaTeX.
