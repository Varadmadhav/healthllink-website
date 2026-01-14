// Global variables
let isSearchActive = false;

// Search functionality
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();
    const testCards = document.querySelectorAll('.test-card');
    const categories = document.querySelectorAll('.category');
    const noResults = document.getElementById('noResults');
    
    isSearchActive = searchTerm.length > 0;
    let hasVisibleCards = false;

    if (isSearchActive) {
        // Hide category filter buttons during search
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.getAttribute('data-filter') !== 'all') {
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });

        // Search through all test cards
        testCards.forEach(card => {
            const testName = card.querySelector('.test-name').textContent.toLowerCase();
            const testDescription = card.querySelector('.test-description').textContent.toLowerCase();
            const category = card.closest('.category');

            if (testName.includes(searchTerm) || testDescription.includes(searchTerm)) {
                card.style.display = 'block';
                category.style.display = 'block';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide categories that have no visible cards
        categories.forEach(category => {
            const visibleCards = category.querySelectorAll('.test-card[style*="display: block"], .test-card:not([style*="display: none"])');
            const actuallyVisibleCards = Array.from(visibleCards).filter(card => 
                card.style.display !== 'none'
            );
            
            if (actuallyVisibleCards.length === 0) {
                category.style.display = 'none';
            }
        });

        // Show/hide no results message
        noResults.style.display = hasVisibleCards ? 'none' : 'block';

    } else {
        // Reset everything when search is cleared
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        });

        // Show all cards and categories
        testCards.forEach(card => {
            card.style.display = 'block';
        });

        categories.forEach(category => {
            category.style.display = 'block';
        });

        noResults.style.display = 'none';

        // Apply current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filter = activeFilter.getAttribute('data-filter');
            applyFilter(filter);
        }
    }
});

// Filter functionality
function applyFilter(filter) {
    if (isSearchActive) return; // Don't apply filters during search

    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        if (filter === 'all' || category.classList.contains(filter)) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

// Event listeners for filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (isSearchActive) return; // Prevent filter changes during search

        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        applyFilter(filter);
    });
});

// Page load animations
document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelectorAll('.category');
    
    // Initial setup for animation
    categories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';

        // Staggered animation
        setTimeout(() => {
            category.style.transition = 'all 0.6s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Additional utility functions
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    // Trigger input event to reset search
    searchInput.dispatchEvent(new Event('input'));
}

// Enhanced search functionality - search by category keywords
function searchByKeywords(searchTerm) {
    const categoryKeywords = {
        'routine': ['routine', 'basic', 'general', 'common', 'standard'],
        'cardiac': ['heart', 'cardiac', 'cardiovascular', 'chest'],
        'diabetes': ['diabetes', 'sugar', 'glucose', 'insulin', 'diabetic'],
        'thyroid': ['thyroid', 'hormone', 'metabolism'],
        'liver': ['liver', 'hepatic', 'bile'],
        'kidney': ['kidney', 'renal', 'urine']
    };

    for (let category in categoryKeywords) {
        if (categoryKeywords[category].some(keyword => 
            keyword.includes(searchTerm) || searchTerm.includes(keyword)
        )) {
            return category;
        }
    }
    return null;
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyFilter,
        clearSearch,
        searchByKeywords
    };
}