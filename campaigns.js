document.addEventListener('DOMContentLoaded', () => {

    const campaigns = [
        {
            title: "Voice for Village Sanitation",
            description: "Spreading awareness about hygiene and building toilets in rural communities.",
            location: "Bihar",
            topic: "Sanitation",
            imageUrl: "https://picsum.photos/seed/c1/400/250",
            link: "campaign-details.html"
        },
        {
            title: "Period Positive Talks",
            description: "Breaking taboos around menstruation with educational audio sessions for girls.",
            location: "Maharashtra",
            topic: "Menstrual Health",
            imageUrl: "https://picsum.photos/seed/c2/400/250",
            link: "campaign-menstrual.html"
        },
        {
            title: "Clean Water, Clear Voice",
            description: "A campaign to ensure access to safe drinking water through community-led initiatives.",
            location: "Jharkhand",
            topic: "Water",
            imageUrl: "https://picsum.photos/seed/c3/400/250",
            link: "campaign-water.html"
        },
        {
            title: "Educate Every Child",
            description: "Using voice messages to encourage school enrollment and reduce dropout rates.",
            location: "Uttar Pradesh",
            topic: "Education",
            imageUrl: "https://picsum.photos/seed/c4/400/250",
            link: "#"
        },
        {
            title: "Open Defecation Free Odisha",
            description: "A large-scale voice campaign to make all villages in Odisha ODF.",
            location: "Odisha",
            topic: "Sanitation",
            imageUrl: "https://picsum.photos/seed/c5/400/250",
            link: "#"
        },
        {
            title: "Assam Water Warriors",
            description: "Promoting rainwater harvesting and safe water storage in flood-prone areas.",
            location: "Assam",
            topic: "Water",
            imageUrl: "https://picsum.photos/seed/c6/400/250",
            link: "#"
        },
        {
            title: "Hygiene for Health",
            description: "Educating communities in Bihar on the importance of handwashing and cleanliness.",
            location: "Bihar",
            topic: "Sanitation",
            imageUrl: "https://picsum.photos/seed/c7/400/250",
            link: "#"
        },
        {
            title: "Girls' Education Drive",
            description: "A voice campaign focused on ensuring girls complete their secondary education.",
            location: "Uttar Pradesh",
            topic: "Education",
            imageUrl: "https://picsum.photos/seed/c8/400/250",
            link: "#"
        }
    ];

    const campaignGrid = document.getElementById('campaign-grid');
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const topicCheckboxes = document.querySelectorAll('input[name="topic"]');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    function renderCampaigns(filteredCampaigns) {
        campaignGrid.innerHTML = '';
        if (filteredCampaigns.length === 0) {
            campaignGrid.innerHTML = '<p>No campaigns found matching your criteria.</p>';
            return;
        }

        filteredCampaigns.forEach(campaign => {
            const card = document.createElement('div');
            card.className = 'campaign-card';
            card.innerHTML = `
                <img src="${campaign.imageUrl}" alt="${campaign.title}" class="card-image">
                <div class="card-content">
                    <div class="card-tags">
                        <span class="tag tag-location">${campaign.location}</span>
                        <span class="tag tag-topic">${campaign.topic}</span>
                    </div>
                    <h3 class="card-title">${campaign.title}</h3>
                    <p class="card-description">${campaign.description}</p>
                    <a href="${campaign.link}" class="card-button">View Campaign</a>
                </div>
            `;
            campaignGrid.appendChild(card);
        });
    }

    function filterCampaigns() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLocation = locationFilter.value;
        const selectedTopics = Array.from(topicCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const filtered = campaigns.filter(campaign => {
            const matchesSearch = campaign.title.toLowerCase().includes(searchTerm) ||
                                  campaign.description.toLowerCase().includes(searchTerm) ||
                                  campaign.location.toLowerCase().includes(searchTerm) ||
                                  campaign.topic.toLowerCase().includes(searchTerm);

            const matchesLocation = selectedLocation === 'all' || campaign.location === selectedLocation;
            
            const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(campaign.topic);

            return matchesSearch && matchesLocation && matchesTopic;
        });

        renderCampaigns(filtered);
    }

    function clearFilters() {
        searchInput.value = '';
        locationFilter.value = 'all';
        topicCheckboxes.forEach(checkbox => checkbox.checked = false);
        filterCampaigns();
    }

    // Initial render
    renderCampaigns(campaigns);

    // Event Listeners
    searchInput.addEventListener('input', filterCampaigns);
    locationFilter.addEventListener('change', filterCampaigns);
    topicCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterCampaigns));
    clearFiltersBtn.addEventListener('click', clearFilters);
}); 