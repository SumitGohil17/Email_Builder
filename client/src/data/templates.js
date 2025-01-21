export const emailTemplates = {
    welcome: {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Perfect for onboarding new users or customers',
        thumbnail: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format',
        styles: {
            titleFont: 'Arial',
            contentFont: 'Arial',
            titleSize: 'xl',
            contentSize: 'md',
            textColor: '#333333',
            alignment: 'left'
        },
        elements: [
            {
                type: 'text',
                x: 50,
                y: 50,
                text: 'Welcome to Our Platform!',
                fontSize: 32,
                fontFamily: 'Arial',
                fill: '#333333',
                textAlign: 'center',
                fontWeight: 'bold',
                id: 'title-welcome'
            },
            {
                type: 'image',
                x: 50,
                y: 120,
                src: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=500&auto=format',
                id: 'image-welcome'
            }
        ]
    },
    newsletter: {
        id: 'newsletter',
        name: 'Newsletter Template',
        description: 'Keep your audience updated with latest news',
        thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format',
        styles: {
            titleFont: 'Georgia',
            contentFont: 'Arial',
            titleSize: 'lg',
            contentSize: 'md',
            textColor: '#222222',
            alignment: 'left'
        },
        elements: [
            {
                type: 'text',
                x: 50,
                y: 50,
                text: 'Monthly Newsletter',
                fontSize: 28,
                fontFamily: 'Georgia',
                fill: '#222222',
                textAlign: 'center',
                fontWeight: 'bold',
                id: 'title-newsletter'
            },
            {
                type: 'image',
                x: 50,
                y: 120,
                src: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=500&auto=format',
                id: 'image-newsletter'
            }
        ]
    },
    promotional: {
        id: 'promotional',
        name: 'Promotional Email',
        description: 'Promote your products or services',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format',
        styles: {
            titleFont: 'Helvetica',
            contentFont: 'Helvetica',
            titleSize: 'xl',
            contentSize: 'lg',
            textColor: '#ffffff',
            alignment: 'center'
        },
        elements: [
            {
                type: 'text',
                x: 50,
                y: 50,
                text: 'Special Offer Inside!',
                fontSize: 36,
                fontFamily: 'Helvetica',
                fill: '#ff4444',
                textAlign: 'center',
                fontWeight: 'bold',
                id: 'title-promo'
            },
            {
                type: 'image',
                x: 50,
                y: 120,
                src: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&auto=format',
                id: 'image-promo'
            }
        ]
    }
};