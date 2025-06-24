// Analytics Page JavaScript

// Mock Analytics Data - Define at the top
const analyticsData = {
    overview: {
        totalCampaigns: 12,
        statesCovered: 8,
        totalListeners: 15420,
        pendingReview: 3
    },
    topicDistribution: {
        'Sanitation': 4,
        'Menstrual Health': 3,
        'Water': 3,
        'Education': 2
    },
    timelineData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Campaigns Created',
            data: [1, 2, 1, 3, 2, 3],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    stateDistribution: {
        'Bihar': 3,
        'Uttar Pradesh': 2,
        'Odisha': 2,
        'West Bengal': 1,
        'Jharkhand': 1,
        'Assam': 1,
        'Madhya Pradesh': 1,
        'Rajasthan': 1
    },
    engagementData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Daily Listeners',
            data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
            backgroundColor: 'rgba(249, 115, 22, 0.8)',
            borderColor: '#f97316',
            borderWidth: 2
        }]
    },
    recentCampaigns: [
        {
            id: 1,
            title: 'Clean Water Initiative - Bihar',
            topic: 'Water',
            date: '2024-01-15',
            location: 'Bihar',
            listeners: 1200,
            status: 'active'
        },
        {
            id: 2,
            title: 'Menstrual Health Awareness',
            topic: 'Menstrual Health',
            date: '2024-01-12',
            location: 'Uttar Pradesh',
            listeners: 890,
            status: 'active'
        },
        {
            id: 3,
            title: 'Education for All - Odisha',
            topic: 'Education',
            date: '2024-01-10',
            location: 'Odisha',
            listeners: 1450,
            status: 'completed'
        },
        {
            id: 4,
            title: 'Sanitation Drive - West Bengal',
            topic: 'Sanitation',
            date: '2024-01-08',
            location: 'West Bengal',
            listeners: 0,
            status: 'review'
        },
        {
            id: 5,
            title: 'Rural Healthcare Awareness',
            topic: 'Health',
            date: '2024-01-05',
            location: 'Jharkhand',
            listeners: 2100,
            status: 'completed'
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Analytics page DOM loaded');

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please check the CDN link.');
        // Show fallback message
        showChartLoadingError();
        return;
    }

    console.log('Chart.js is loaded, version:', Chart.version);

    // Initialize analytics page
    initializeAnalytics();

    function initializeAnalytics() {
        console.log('Initializing analytics...');

        // Load mock data
        loadAnalyticsData();

        // Check if chart containers exist
        const chartContainers = ['topicsChart', 'timelineChart', 'statesChart', 'engagementChart'];
        chartContainers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                console.log(`Found chart container: ${id}`);
            } else {
                console.error(`Chart container not found: ${id}`);
            }
        });

        // Wait a bit for DOM to be fully ready, then initialize charts
        setTimeout(() => {
            initializeCharts();
        }, 100);

        // Initialize interactions
        initializeInteractions();

        // Animate stats numbers
        animateStatsNumbers();

        // Load recent campaigns
        loadRecentCampaigns();
    }

    function showChartLoadingError() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #6b7280;">
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>Chart.js failed to load. Please refresh the page.</p>
                    </div>
                </div>
            `;
        });
    }
    

    
    function loadAnalyticsData() {
        // Data is already loaded at the top of the file
        console.log('Analytics data loaded:', analyticsData);
        // Store data globally for chart access
        window.analyticsData = analyticsData;
    }
    
    function initializeCharts() {
        try {
            // Topics Pie Chart
            initializeTopicsChart();

            // Timeline Line Chart
            initializeTimelineChart();

            // States Bar Chart
            initializeStatesChart();

            // Engagement Chart
            initializeEngagementChart();

            console.log('All charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
            showChartLoadingError();
        }
    }
    
    function initializeTopicsChart() {
        try {
            const canvas = document.getElementById('topicsChart');
            if (!canvas) {
                console.error('Topics chart canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            const data = analyticsData.topicDistribution;

            const colors = ['#f97316', '#ea580c', '#fb923c', '#fed7aa'];

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        data: Object.values(data),
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.parsed / total) * 100);
                                    return `${context.label}: ${context.parsed} campaigns (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });

            // Create custom legend
            createTopicsLegend(data, colors);
            console.log('Topics chart initialized');
        } catch (error) {
            console.error('Error initializing topics chart:', error);
        }
    }
    
    function createTopicsLegend(data, colors) {
        const legendContainer = document.getElementById('topicsLegend');
        legendContainer.innerHTML = '';
        
        Object.keys(data).forEach((topic, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${colors[index]}"></div>
                <span>${topic} (${data[topic]})</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }
    
    function initializeTimelineChart() {
        try {
            const canvas = document.getElementById('timelineChart');
            if (!canvas) {
                console.error('Timeline chart canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: analyticsData.timelineData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 4,
                            hoverRadius: 6
                        }
                    }
                }
            });
            console.log('Timeline chart initialized');
        } catch (error) {
            console.error('Error initializing timeline chart:', error);
        }
    }
    
    function initializeStatesChart() {
        try {
            const canvas = document.getElementById('statesChart');
            if (!canvas) {
                console.error('States chart canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            const data = analyticsData.stateDistribution;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        label: 'Campaigns',
                        data: Object.values(data),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)',
                        borderColor: '#f97316',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45
                            }
                        }
                    }
                }
            });
            console.log('States chart initialized');
        } catch (error) {
            console.error('Error initializing states chart:', error);
        }
    }
    
    function initializeEngagementChart() {
        try {
            const canvas = document.getElementById('engagementChart');
            if (!canvas) {
                console.error('Engagement chart canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: analyticsData.engagementData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            console.log('Engagement chart initialized');
        } catch (error) {
            console.error('Error initializing engagement chart:', error);
        }
    }
    
    function initializeInteractions() {
        // Time filter buttons
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                timeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Here you would typically reload the timeline chart with different data
                showNotification(`Showing data for: ${btn.textContent}`, 'info');
            });
        });
        
        // Export data button
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportAnalyticsData();
            });
        }
        
        // Create campaign button
        const createBtn = document.getElementById('create-campaign');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.location.href = 'start-campaign.html';
            });
        }
        
        // Engagement period selector
        const engagementPeriod = document.getElementById('engagementPeriod');
        if (engagementPeriod) {
            engagementPeriod.addEventListener('change', (e) => {
                showNotification(`Engagement period changed to: ${e.target.value}`, 'info');
            });
        }
    }
    
    function animateStatsNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target);
        });
    }
    
    function animateNumber(element, target) {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    function loadRecentCampaigns() {
        const container = document.getElementById('recentCampaigns');
        container.innerHTML = '';
        
        analyticsData.recentCampaigns.forEach(campaign => {
            const campaignElement = createCampaignElement(campaign);
            container.appendChild(campaignElement);
        });
    }
    
    function createCampaignElement(campaign) {
        const div = document.createElement('div');
        div.className = 'campaign-item';
        
        const statusClass = campaign.status === 'active' ? 'success' : 
                           campaign.status === 'review' ? 'warning' : 'info';
        
        div.innerHTML = `
            <div class="campaign-info">
                <div class="campaign-title">${campaign.title}</div>
                <div class="campaign-meta">
                    <span class="campaign-topic" style="color: var(--${statusClass})">${campaign.topic}</span>
                    <span>${formatDate(campaign.date)}</span>
                    <span>${campaign.location}</span>
                    <span>${campaign.listeners.toLocaleString()} listeners</span>
                </div>
            </div>
            <div class="campaign-actions">
                <button class="murf-btn" disabled title="Murf AI Integration Coming Soon">
                    <i class="fas fa-robot"></i>
                    AI Insights
                </button>
            </div>
        `;
        
        return div;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    function exportAnalyticsData() {
        // Create CSV data
        const csvData = createCSVData();
        
        // Create and download file
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saarthi-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Analytics data exported successfully!', 'success');
    }
    
    function createCSVData() {
        let csv = 'Campaign Title,Topic,Date,Location,Listeners,Status\n';
        
        analyticsData.recentCampaigns.forEach(campaign => {
            csv += `"${campaign.title}","${campaign.topic}","${campaign.date}","${campaign.location}",${campaign.listeners},"${campaign.status}"\n`;
        });
        
        return csv;
    }
    
    // Utility function for notifications (assuming it exists from dashboard.js)
    function showNotification(message, type = 'info') {
        // This function should be available from dashboard.js
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Fallback function to create simple visual charts if Chart.js fails
    function createFallbackCharts() {
        console.log('Creating fallback charts...');

        // Topics Chart Fallback
        const topicsContainer = document.getElementById('topicsChart')?.parentElement;
        if (topicsContainer) {
            topicsContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937;">Campaign Topics</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="padding: 1rem; background: #f97316; color: white; border-radius: 0.5rem;">
                            <strong>Sanitation</strong><br>4 campaigns
                        </div>
                        <div style="padding: 1rem; background: #ea580c; color: white; border-radius: 0.5rem;">
                            <strong>Menstrual Health</strong><br>3 campaigns
                        </div>
                        <div style="padding: 1rem; background: #fb923c; color: white; border-radius: 0.5rem;">
                            <strong>Water</strong><br>3 campaigns
                        </div>
                        <div style="padding: 1rem; background: #fed7aa; color: #1f2937; border-radius: 0.5rem;">
                            <strong>Education</strong><br>2 campaigns
                        </div>
                    </div>
                </div>
            `;
        }

        // Timeline Chart Fallback
        const timelineContainer = document.getElementById('timelineChart')?.parentElement;
        if (timelineContainer) {
            timelineContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937;">Campaign Timeline</h4>
                    <div style="display: flex; justify-content: space-between; align-items: end; height: 150px; border-bottom: 2px solid #e5e7eb; padding: 1rem 0;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 20px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Jan</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 40px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Feb</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 20px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Mar</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 60px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Apr</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 40px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>May</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; height: 60px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Jun</small>
                        </div>
                    </div>
                </div>
            `;
        }

        // States Chart Fallback
        const statesContainer = document.getElementById('statesChart')?.parentElement;
        if (statesContainer) {
            statesContainer.innerHTML = `
                <div style="padding: 2rem;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937; text-align: center;">State Distribution</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Bihar</span>
                            <div style="flex: 1; margin: 0 1rem; height: 20px; background: #e5e7eb; border-radius: 10px;">
                                <div style="width: 60%; height: 100%; background: #f97316; border-radius: 10px;"></div>
                            </div>
                            <span>3</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>UP</span>
                            <div style="flex: 1; margin: 0 1rem; height: 20px; background: #e5e7eb; border-radius: 10px;">
                                <div style="width: 40%; height: 100%; background: #f97316; border-radius: 10px;"></div>
                            </div>
                            <span>2</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Odisha</span>
                            <div style="flex: 1; margin: 0 1rem; height: 20px; background: #e5e7eb; border-radius: 10px;">
                                <div style="width: 40%; height: 100%; background: #f97316; border-radius: 10px;"></div>
                            </div>
                            <span>2</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Engagement Chart Fallback
        const engagementContainer = document.getElementById('engagementChart')?.parentElement;
        if (engagementContainer) {
            engagementContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937;">Weekly Engagement</h4>
                    <div style="display: flex; justify-content: space-between; align-items: end; height: 120px; border-bottom: 2px solid #e5e7eb; padding: 1rem 0;">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 60px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Mon</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 95px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Tue</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 75px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Wed</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 105px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Thu</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 90px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Fri</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 120px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Sat</small>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; height: 110px; background: #f97316; margin-bottom: 0.5rem;"></div>
                            <small>Sun</small>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // If Chart.js fails to load after 3 seconds, show fallback
    setTimeout(() => {
        if (typeof Chart === 'undefined') {
            console.log('Chart.js still not loaded after 3 seconds, showing fallback charts');
            createFallbackCharts();
        }
    }, 3000);
});
