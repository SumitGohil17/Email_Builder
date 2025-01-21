export const templateTypes = {
    welcome: {
        name: 'Welcome Email',
        sections: [
            { type: 'logo', editable: true },
            { type: 'header', content: 'Welcome to {{company_name}}!', editable: true },
            { type: 'text', content: 'Hi {{user_name}}', editable: true },
            { type: 'text', content: 'Thank you for joining us!', editable: true },
            { type: 'button', text: 'Get Started', url: '#', editable: true },
        ],
        variables: ['company_name', 'user_name']
    },
    newsletter: {
        name: 'Newsletter',
        sections: [
            { type: 'logo', editable: true },
            { type: 'header', content: 'Newsletter Title', editable: true },
            { type: 'image', editable: true },
            { type: 'text', content: 'Main article content', editable: true },
            { type: 'button', text: 'Read More', url: '#', editable: true },
        ],
        variables: ['issue_number', 'date']
    },
    promotional: {
        name: 'Promotional',
        sections: [
            { type: 'image', editable: true },
            { type: 'header', content: 'Special Offer!', editable: true },
            { type: 'text', content: 'Limited time deal', editable: true },
            { type: 'button', text: 'Shop Now', url: '#', editable: true },
        ],
        variables: ['offer_code', 'expiry_date']
    }
};
