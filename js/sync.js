// ===== 数据同步层：优先读取 localStorage，回退到 data.js 默认数据 =====
(function() {
  const sections = ['companyNews', 'applications', 'products', 'exhibitions', 'domesticEnterprises', 'talentJobs'];
  sections.forEach(function(key) {
    var stored = localStorage.getItem('tapenews_' + key);
    if (stored) {
      try {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          window[key] = parsed;
        }
      } catch(e) {}
    }
  });
})();
