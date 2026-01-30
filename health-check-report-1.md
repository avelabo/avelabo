● Here's a comprehensive audit of problematic code in the codebase:                                
                                                                                                                         
  Critical Issues Found                                                                                                                                                                                                                           
  1. XSS Vulnerability - ProductDetail.jsx:351                                                                                                                                                                                                    
  <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }} />
  Problem: Unsanitized HTML rendering. Malicious scripts in product descriptions will execute.
  Fix: Use DOMPurify to sanitize.

  ---
  2. Race Condition - Create.jsx:24-52 & Edit.jsx:25-53

  const fetchSourceCategories = async () => {
      const response = await axios.post(url, { data_source_id: data.data_source_id });
      setSourceCategories(response.data.categories);
  };
  Problem: Rapid changes fire multiple requests. If request #2 finishes before #1, stale data overwrites fresh data.     
  Fix: Add AbortController and cleanup.

  ---
  3. N+1 Query - ShopController.php:137-171

  ->map(function ($category) {
      $productCount = Product::where('category_id', $category->id)->count(); // Query per category!
  Problem: With 10 categories + subcategories = 40+ queries instead of 1.
  Fix: Use withCount() eager loading.

  ---
  4. Potential Image Loop - CategorySlider.jsx:54

  onError={(e) => { e.target.src = '/images/frontend/placeholder-category.png'; }}
  Problem: Same infinite loop pattern we just fixed if placeholder is missing.

  ---
  5. State Update After Unmount - Create.jsx:35-51

  try {
      const response = await axios.post(...);
      setSourceCategories(response.data.categories); // Component may be unmounted
  }
  Problem: Memory leak warning if user navigates away during request.

  ---
  Summary
  ┌──────────────────────┬───────────────────────┬──────────┐
  │        Issue         │         File          │ Severity │
  ├──────────────────────┼───────────────────────┼──────────┤
  │ XSS vulnerability    │ ProductDetail.jsx:351 │ HIGH     │
  ├──────────────────────┼───────────────────────┼──────────┤
  │ Race condition       │ Create.jsx, Edit.jsx  │ HIGH     │
  ├──────────────────────┼───────────────────────┼──────────┤
  │ N+1 queries          │ ShopController.php    │ HIGH     │
  ├──────────────────────┼───────────────────────┼──────────┤
  │ Image loop risk      │ CategorySlider.jsx:54 │ MEDIUM   │
  ├──────────────────────┼───────────────────────┼──────────┤
  │ Unmount state update │ Create.jsx            │ MEDIUM   │