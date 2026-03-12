const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const combineSchemas = async () => {
  try {
    const schemasDir = path.join(__dirname, '../schemas');
    const outputPath = path.join(__dirname, '../schema.prisma');

    // Find all .prisma files in the schemas directory
    const schemaFiles = await glob(`${schemasDir}/**/*.prisma`);

    if (schemaFiles.length === 0) {
      console.log('No schema files found to combine.');
      return;
    }

    // Sort files to ensure a consistent order, putting _base.prisma first
    schemaFiles.sort((a, b) => {
      if (path.basename(a) === '_base.prisma') return -1;
      if (path.basename(b) === '_base.prisma') return 1;
      return a.localeCompare(b);
    });

    // Start with a warning comment
    let combinedSchema = `// ------------------------------------------------------
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT IT DIRECTLY.
// TO MAKE CHANGES, EDIT THE FILES IN THE /prisma/schemas/ DIRECTORY.
// ------------------------------------------------------\n\n`;

    // Read the content of each file and concatenate it
    for (const file of schemaFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      combinedSchema += `// --- From: ${path.basename(file)} ---\n\n${content}\n\n`;
    }

    // Write the combined content to the main schema.prisma file
    fs.writeFileSync(outputPath, combinedSchema);
    console.log(`Successfully combined ${schemaFiles.length} schema files into schema.prisma.`);

  } catch (error) {
    console.error('Error combining Prisma schemas:', error);
    process.exit(1);
  }
};

combineSchemas();