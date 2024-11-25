
export function updateStoredXML(vocabulary) {
    let storedXML = `<?xml version="1.0" encoding="UTF-8"?>\n<GLOSSARY>\n  <INFO>\n    <NAME>La ciudad</NAME>\n    <ENTRIES>\n`;

    vocabulary.forEach(entry => {
        storedXML += `      <ENTRY>\n`;
        storedXML += `        <CONCEPT>${entry.word}</CONCEPT>\n`;
        storedXML += `        <DEFINITION>${entry.definition}</DEFINITION>\n`;
        storedXML += `      </ENTRY>\n`;
    });

    storedXML += `    </ENTRIES>\n  </INFO>\n</GLOSSARY>`;
    return storedXML;
}

export function exportXML(vocabulary, storedXML) {


    if (!Array.isArray(vocabulary)) {
        alert('Vocabulary is not an array!');
        return;
    }

    if (vocabulary.length === 0) {
        alert('No vocabulary to export!');
        return;
    }

    const blob = new Blob([storedXML], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vocabulary.xml';
    link.click();
}

export function importXML(vocabulary, updateList, updateStoredXML, storedXML) {
    const fileInput = document.getElementById('import-xml');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an XML file to import.');
        return;
    }

    // Limit file size to 1MB to prevent DoS
    if (file.size > 1024 * 1024) {
        alert('File is too large. Please select a file smaller.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            // Parse the XML securely
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, 'application/xml');

            // Check for parsing errors
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                throw new Error('Error parsing XML file.');
            }

            const entries = xmlDoc.getElementsByTagName('ENTRY');
            for (let i = 0; i < entries.length; i++) {
                const word = entries[i].getElementsByTagName('CONCEPT')[0]?.textContent?.trim();
                const definition = entries[i].getElementsByTagName('DEFINITION')[0]?.textContent?.trim();

                // Validate the structure and content of the XML
                if (word && definition && !vocabulary.some(entry => entry.word === word)) {
                    vocabulary.push({ word, definition });
                }
            }

            updateList(vocabulary); // Refresh the vocabulary list
            storedXML = updateStoredXML(vocabulary); // Update stored XML with imported data
            alert('Vocabulary imported successfully!');
        } catch (error) {
            alert(`Failed to import XML: ${error.message}`);
        }
    };

    reader.readAsText(file);
}

