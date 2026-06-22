// ===== 数据同步层：直接从 data.js 加载（管理后台通过 GitHub 更新） =====
// 不再使用 localStorage 缓存，确保与 GitHub 数据一致
(function() {
  // data.js 中的 const 声明会自动挂到 window 上
  // 此文件保留用于未来扩展（如数据预加载、版本检测等）
  console.log('[同步] 数据已从 data.js 加载');
})();
