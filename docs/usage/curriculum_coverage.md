# Curriculum Coverage

The application estimates how well a student's uploaded work covers each node of a curriculum.
All uploaded work with a non-null `masteryPercent` above the
`COVERAGE_MASTERY_THRESHOLD` environment variable (default `0`) is embedded and compared
against the tag embeddings for each DAG node. For every node tag the highest
similarity score across the student's work is multiplied by the work's
`masteryPercent` and averaged to produce a coverage percentage for that node.

Teachers can override this threshold for each student on the progress page using
the **Coverage Threshold** field (look for the blue **i** tooltip). Work below
the chosen percentage is ignored when computing coverage.

When viewing a student's curriculum the graph displays these percentages after
each node label so teachers can quickly spot areas that need more practice.
