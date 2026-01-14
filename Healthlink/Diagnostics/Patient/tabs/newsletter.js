let currentCategory = 'general';
        let searchResults = [];

        // Simulated medical articles database
        const medicalArticles = {
            'general': [
                {
                    title: "10 Essential Health Habits for a Longer Life",
                    snippet: "Discover evidence-based lifestyle changes that can significantly impact your longevity and quality of life.",
                    source: "Harvard Health Publishing",   
                    url: "news_letter/health_habits/essential.html",
                    category: "Preventive Care"
                },
                {
                    title: "Understanding Your Annual Physical Exam",
                    snippet: "Learn what to expect during your yearly check-up and how to make the most of your visit with your doctor.",
                    source: "Mayo Clinic",
                    url: "news_letter/physical/physical.html",
                    category: "Preventive Care"
                }
            ],
            'heart disease': [
                {
                    title: "Heart Disease Prevention: Your Complete Guide",
                    snippet: "Comprehensive strategies for preventing cardiovascular disease through diet, exercise, and lifestyle modifications.",
                    source: "American Heart Association",
                    url: "https://www.heart.org/en/health-topics/prevention",
                    category: "Cardiology"
                },
                {
                    title: "Understanding High Blood Pressure",
                    snippet: "Learn about hypertension causes, symptoms, and management strategies for better heart health.",
                    source: "CDC",
                    url: "https://www.cdc.gov/bloodpressure/about.htm",
                    category: "Cardiology"
                }
            ],
            'diabetes': [
                {
                    title: "Type 2 Diabetes: Causes, Symptoms, and Treatment",
                    snippet: "Comprehensive guide to understanding and managing type 2 diabetes mellitus.",
                    source: "American Diabetes Association",
                    url: "https://www.diabetes.org/diabetes/type-2",
                    category: "Endocrinology"
                },
                {
                    title: "Diabetes Diet: Create Your Healthy-Eating Plan",
                    snippet: "Expert nutritional guidance for managing diabetes through proper meal planning and food choices.",
                    source: "Mayo Clinic",
                    url: "https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-diet/art-20044295",
                    category: "Nutrition"
                }
            ],
            'cancer': [
                {
                    title: "Cancer Prevention: What You Need to Know",
                    snippet: "Evidence-based strategies for reducing cancer risk through lifestyle modifications and screening.",
                    source: "National Cancer Institute",
                    url: "https://www.cancer.gov/about-cancer/causes-prevention",
                    category: "Oncology"
                },
                {
                    title: "Understanding Cancer Screening Guidelines",
                    snippet: "Current recommendations for various cancer screening tests and their importance in early detection.",
                    source: "American Cancer Society",
                    url: "https://www.cancer.org/healthy/find-cancer-early/cancer-screening-guidelines.html",
                    category: "Preventive Care"
                }
            ],
            'mental health': [
                {
                    title: "Managing Stress and Anxiety in Daily Life",
                    snippet: "Practical techniques for coping with stress and anxiety using evidence-based approaches.",
                    source: "National Institute of Mental Health",
                    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
                    category: "Mental Health"
                },
                {
                    title: "Depression: Signs, Symptoms, and Treatment Options",
                    snippet: "Understanding depression and available treatment approaches including therapy and medication.",
                    source: "Mayo Clinic",
                    url: "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
                    category: "Mental Health"
                }
            ],
            'nutrition': [
                {
                    title: "The Mediterranean Diet: A Heart-Healthy Eating Plan",
                    snippet: "Explore the benefits and principles of the Mediterranean diet for cardiovascular and overall health.",
                    source: "Harvard T.H. Chan School of Public Health",
                    url: "https://www.hsph.harvard.edu/nutritionsource/healthy-weight/diet-reviews/mediterranean-diet/",
                    category: "Nutrition"
                },
                {
                    title: "Vitamins and Minerals: What You Need to Know",
                    snippet: "Complete guide to essential nutrients, their functions, and how to ensure adequate intake.",
                    source: "NIH Office of Dietary Supplements",
                    url: "https://ods.od.nih.gov/factsheets/list-VitaminsMinerals/",
                    category: "Nutrition"
                }
            ],
            'covid': [
                {
                    title: "COVID-19: Current Guidelines and Prevention",
                    snippet: "Latest information on COVID-19 prevention, symptoms, and treatment recommendations.",
                    source: "CDC",
                    url: "https://www.cdc.gov/coronavirus/2019-ncov/",
                    category: "Infectious Disease"
                },
                {
                    title: "Long COVID: Understanding Persistent Symptoms",
                    snippet: "Information about long-term effects of COVID-19 and management strategies for ongoing symptoms.",
                    source: "WHO",
                    url: "https://www.who.int/news-room/questions-and-answers/item/coronavirus-disease-(covid-19)-post-covid-19-condition",
                    category: "Infectious Disease"
                }
            ],
            'vaccines': [
                {
                    title: "Adult Vaccination Schedule and Recommendations",
                    snippet: "Current CDC guidelines for adult immunizations and vaccine schedules by age group.",
                    source: "CDC",
                    url: "https://www.cdc.gov/vaccines/schedules/hcp/imz/adult.html",
                    category: "Preventive Care"
                },
                {
                    title: "Vaccine Safety: Facts and Evidence",
                    snippet: "Comprehensive information about vaccine safety monitoring and the scientific evidence supporting immunization.",
                    source: "FDA",
                    url: "https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics/vaccine-safety-monitoring",
                    category: "Public Health"
                }
            ]
        };

        window.location.href = article.url;


        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArticles();
            }
        });

        function selectCategory(category) {
            currentCategory = category;
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Load articles for category
            loadCategoryArticles(category);
        }

        function loadCategoryArticles(category) {
            showLoading();
            
            setTimeout(() => {
                const articles = medicalArticles[category] || [];
                displayArticles(articles);
            }, 500);
        }

        function searchArticles() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            
            if (!query) {
                loadCategoryArticles(currentCategory);
                return;
            }
            
            showLoading();
            
            setTimeout(() => {
                let results = [];
                
                // Search through all categories
                Object.values(medicalArticles).forEach(categoryArticles => {
                    categoryArticles.forEach(article => {
                        if (article.title.toLowerCase().includes(query) || 
                            article.snippet.toLowerCase().includes(query) ||
                            article.category.toLowerCase().includes(query)) {
                            results.push(article);
                        }
                    });
                });
                
                displayArticles(results);
            }, 800);
        }

        function showLoading() {
            document.getElementById('loadingDiv').style.display = 'block';
            document.getElementById('articlesContainer').innerHTML = '';
            document.getElementById('noResults').style.display = 'none';
        }

        function displayArticles(articles) {
            document.getElementById('loadingDiv').style.display = 'none';
            const container = document.getElementById('articlesContainer');
            
            if (articles.length === 0) {
                document.getElementById('noResults').style.display = 'block';
                container.innerHTML = '';
                return;
            }
            
            document.getElementById('noResults').style.display = 'none';
            
            container.innerHTML = articles.map(article => `
                <div class="article-card">
                    <h3 class="article-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            ${article.title}
                        </a>
                    </h3>
                    <div class="article-meta">
                        <span class="article-source">${article.source}</span>
                        <span>${article.category}</span>
                    </div>
                    <p class="article-snippet">${article.snippet}</p>
                    <div class="article-actions">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn-small btn-primary">
                            Read Full Article
                        </a>
                        <button onclick="shareArticle('${article.title}', '${article.url}')" class="btn-small btn-outline">
                            Share
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function shareArticle(title, url) {
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    alert('Article link copied to clipboard!');
                });
            }
        }

        // Load initial articles
        window.addEventListener('load', () => {
            loadCategoryArticles('general');
        });