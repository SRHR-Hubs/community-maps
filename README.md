Monorepo for SRHR Hubs Toronto's Community Maps project. Documentation will follow below as needed.

# /frontend
## File structure
In general, prefer maximum specificity by nesting new aditions in as many directories as needed. However, note that we will **not** be using the new Next 13 pages syntax until it becomes fully production-stable. The most important export for each subdirectorydirectory under `/components` or `/pages` should be under `index.js`, with 'companion' or subsidiary components optionally having named files.
### Adding a Page and styling it
When adding a page, it is best to create an SCSS file for it under `styles/pages`, keeping homology between it and the actual `pages` directory however possible (replacing, say, wildcard routes with a more reasonable name).
Then, in `main.scss`, add a `@forward` statement to include it in the final CSS output.

Follow the same pattern for adding components wherever 
