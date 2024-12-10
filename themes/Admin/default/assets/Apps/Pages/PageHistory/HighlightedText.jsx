import React from 'react';

const HighlightedText = ({ text, color }) => {
    if (!text) return null;

    // Divise le texte en mots (en utilisant des espaces et ponctuation comme séparateurs)
    const words = text.split(/(\s+|[\.,;!?])/);

    return (
        <div>
            {words.map((word, index) => (
                <span
                    key={index}
                    style={{
                        backgroundColor: color,
                        color: 'white',
                        padding: '0 4px',
                        borderRadius: '4px',
                        marginRight: '2px',
                        display: 'inline-block',
                    }}
                >
                    {word}
                </span>
            ))}
        </div>
    );
};

export default HighlightedText;
