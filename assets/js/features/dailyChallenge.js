/* features/dailyChallenge.js — Daily Coding Challenge Generator
   Exposes SHIBI.Challenge (also aliased as SHIBI.DailyChallenge for backward compat).
   60-problem bank embedded. Deterministic daily selection.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Challenge = (function () {

  /* ── Problem bank (60 real problems) ──────────────────── */
  var PROBLEM_BANK = {
    easy: [
      {id:'e01',title:'Two Sum',topic:'arrays',
       statement:'Given an array of integers and a target, return indices of the two numbers that add up to the target. Each input has exactly one solution; you may not use the same element twice.',
       examples:[{input:'[2,7,11,15], target=9',output:'[0,1]',explanation:'nums[0]+nums[1]=9'}],
       hint:'Try storing previously-seen numbers in a hash map.',approach:'For each number x, check if (target - x) exists in a HashMap built on the fly. One pass, O(n).',leetcodeSlug:'two-sum'},
      {id:'e02',title:'Best Time to Buy and Sell Stock',topic:'arrays',
       statement:'Given daily prices, find the maximum profit from one buy-then-sell transaction. If no profit is possible, return 0.',
       examples:[{input:'[7,1,5,3,6,4]',output:'5',explanation:'Buy day 2 (1), sell day 5 (6)'}],
       hint:'Track the minimum price seen so far.',approach:'Scan once: keep running min price and compare profit at each step. O(n) time, O(1) space.',leetcodeSlug:'best-time-to-buy-and-sell-stock'},
      {id:'e03',title:'Contains Duplicate',topic:'arrays',
       statement:'Return true if any value appears at least twice in the array, false if all elements are distinct.',
       examples:[{input:'[1,2,3,1]',output:'true',explanation:'1 appears twice'}],
       hint:'A HashSet lets you check membership in O(1).',approach:'Insert elements one by one into a set; return true the moment a duplicate is found.',leetcodeSlug:'contains-duplicate'},
      {id:'e04',title:'Valid Anagram',topic:'strings',
       statement:'Given two strings s and t, return true if t is an anagram of s — same characters, same frequencies, possibly reordered.',
       examples:[{input:'s="anagram", t="nagaram"',output:'true',explanation:'Same character counts'}],
       hint:'Count character frequencies using an array or map.',approach:'Build a frequency count for s, decrement for t. If all counts are zero, they are anagrams.',leetcodeSlug:'valid-anagram'},
      {id:'e05',title:'Valid Parentheses',topic:'stack',
       statement:'Given a string containing only ( ) [ ] { }, determine if the brackets are properly closed and nested.',
       examples:[{input:'"()[]{}"',output:'true',explanation:'Each open bracket is closed in order'}],
       hint:'A stack naturally handles nested matching.',approach:'Push opening brackets onto a stack. When a closing bracket appears, check if the top matches.',leetcodeSlug:'valid-parentheses'},
      {id:'e06',title:'Reverse String',topic:'strings',
       statement:'Reverse the input character array in-place. Do it with O(1) extra memory.',
       examples:[{input:'["h","e","l","l","o"]',output:'["o","l","l","e","h"]',explanation:'Array reversed in-place'}],
       hint:'Two pointers from both ends work perfectly.',approach:'Swap characters at positions lo and hi, move both inward until they meet. O(n) time, O(1) space.',leetcodeSlug:'reverse-string'},
      {id:'e07',title:'Palindrome Check',topic:'strings',
       statement:'Given a string, return true if it reads the same forwards and backwards (ignoring case and non-alphanumeric characters).',
       examples:[{input:'"A man, a plan, a canal: Panama"',output:'true',explanation:'Cleaned string is a palindrome'}],
       hint:'Filter to alphanumeric, then use two pointers.',approach:'Strip non-alphanumerics, lowercase, then compare chars from both ends with two pointers.',leetcodeSlug:'valid-palindrome'},
      {id:'e08',title:'Maximum Subarray (Kadane\'s)',topic:'arrays',
       statement:'Find the contiguous subarray with the largest sum and return that sum.',
       examples:[{input:'[-2,1,-3,4,-1,2,1,-5,4]',output:'6',explanation:'Subarray [4,-1,2,1] has sum 6'}],
       hint:'Decide at each element: extend existing subarray or start fresh.',approach:'Kadane\'s: keep currentSum = max(num, currentSum + num). Update maxSum each step. O(n).',leetcodeSlug:'maximum-subarray'},
      {id:'e09',title:'Missing Number',topic:'arrays',
       statement:'Given an array of n distinct numbers from 0 to n, find the one missing number.',
       examples:[{input:'[3,0,1]',output:'2',explanation:'Range 0-3, 2 is missing'}],
       hint:'The expected sum of 0..n is n*(n+1)/2.',approach:'Expected sum minus actual sum gives the missing number. O(n) time, O(1) space.',leetcodeSlug:'missing-number'},
      {id:'e10',title:'Single Number',topic:'arrays',
       statement:'Every element in the array appears exactly twice except one. Find that one element.',
       examples:[{input:'[4,1,2,1,2]',output:'4',explanation:'4 appears once; rest appear twice'}],
       hint:'XOR of equal numbers is 0.',approach:'XOR all elements together. Pairs cancel to 0; only the single number remains. O(n) time, O(1) space.',leetcodeSlug:'single-number'},
      {id:'e11',title:'Reverse Linked List',topic:'linked_list',
       statement:'Reverse a singly linked list and return the new head.',
       examples:[{input:'1→2→3→4→5',output:'5→4→3→2→1',explanation:'List reversed in-place'}],
       hint:'Use three pointers: prev, curr, next.',approach:'Iteratively redirect each node\'s next pointer to the previous node. O(n) time, O(1) space.',leetcodeSlug:'reverse-linked-list'},
      {id:'e12',title:'Merge Two Sorted Lists',topic:'linked_list',
       statement:'Merge two sorted linked lists and return the head of the merged sorted list.',
       examples:[{input:'1→2→4, 1→3→4',output:'1→1→2→3→4→4',explanation:'Both lists merged in order'}],
       hint:'Compare heads and pick the smaller one at each step.',approach:'Use a dummy head node. At each step, attach the smaller current node and advance that pointer.',leetcodeSlug:'merge-two-sorted-lists'},
      {id:'e13',title:'Binary Search',topic:'binary_search',
       statement:'Given a sorted array and a target, return the index of target or -1 if not found.',
       examples:[{input:'[-1,0,3,5,9,12], target=9',output:'4',explanation:'9 is at index 4'}],
       hint:'Compare mid element and eliminate half the array each time.',approach:'lo=0, hi=n-1. While lo≤hi: mid=(lo+hi)/2. If nums[mid]=target return mid; adjust lo or hi.',leetcodeSlug:'binary-search'},
      {id:'e14',title:'First Bad Version',topic:'binary_search',
       statement:'Given n versions and an isBadVersion(v) API, find the first bad version with minimum API calls.',
       examples:[{input:'n=5, bad=4',output:'4',explanation:'Versions 4 and 5 are bad; 4 is first'}],
       hint:'Binary search the first true value.',approach:'Binary search: if isBadVersion(mid) is true, bad version is at mid or earlier. Else it\'s after mid.',leetcodeSlug:'first-bad-version'},
      {id:'e15',title:'Climbing Stairs',topic:'recursion',
       statement:'You can climb 1 or 2 steps at a time. In how many distinct ways can you reach the top of n stairs?',
       examples:[{input:'n=3',output:'3',explanation:'1+1+1, 1+2, 2+1'}],
       hint:'ways(n) = ways(n-1) + ways(n-2) — it\'s Fibonacci.',approach:'Iteratively compute: dp[i] = dp[i-1] + dp[i-2]. Start with dp[1]=1, dp[2]=2. O(n) time O(1) space.',leetcodeSlug:'climbing-stairs'},
      {id:'e16',title:'Fibonacci Number',topic:'recursion',
       statement:'Return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
       examples:[{input:'n=4',output:'3',explanation:'F(4)=F(3)+F(2)=2+1=3'}],
       hint:'Avoid recursion — compute iteratively in O(n).',approach:'Keep two variables a and b. At each step: a,b = b, a+b. After n iterations b holds F(n).',leetcodeSlug:'fibonacci-number'},
      {id:'e17',title:'Count Vowels in String',topic:'strings',
       statement:'Return the number of vowel characters (a e i o u, case-insensitive) in the given string.',
       examples:[{input:'"Hello World"',output:'3',explanation:'e, o, o are vowels'}],
       hint:'A Set of vowels makes the membership check clean.',approach:'Iterate the string; for each character check if it\'s in a vowel set. Increment counter if yes.',leetcodeSlug:null},
      {id:'e18',title:'Remove Duplicates from Sorted Array',topic:'arrays',
       statement:'Remove duplicates in a sorted array in-place. Return the count of unique elements; the first k elements of the array must hold them.',
       examples:[{input:'[1,1,2]',output:'2 — [1,2,_]',explanation:'Two unique elements'}],
       hint:'A write pointer tracks where to place the next unique element.',approach:'Two pointers: i scans, j writes. When nums[i] ≠ nums[j-1], write nums[i] to position j and advance j.',leetcodeSlug:'remove-duplicates-from-sorted-array'},
      {id:'e19',title:'Move Zeroes',topic:'arrays',
       statement:'Move all 0s to the end of the array while maintaining the relative order of non-zero elements, in-place.',
       examples:[{input:'[0,1,0,3,12]',output:'[1,3,12,0,0]',explanation:'Zeros moved to end'}],
       hint:'Use a write pointer for non-zero elements.',approach:'Scan with read pointer; when non-zero found, write it at the write pointer index and advance write. Fill rest with 0.',leetcodeSlug:'move-zeroes'},
      {id:'e20',title:'Plus One',topic:'arrays',
       statement:'A large integer is stored as an array of its digits. Add one to the integer and return the resulting array.',
       examples:[{input:'[1,2,3]',output:'[1,2,4]',explanation:'123+1=124'}],
       hint:'Handle carry propagation from the last digit leftward.',approach:'Traverse from the end. If digit < 9, increment and return. If 9, set to 0 and carry. Prepend 1 if needed.',leetcodeSlug:'plus-one'},
      {id:'e21',title:'Find Min in Rotated Sorted Array',topic:'binary_search',
       statement:'A sorted array was rotated at some pivot. Find the minimum element in O(log n) without duplicates.',
       examples:[{input:'[3,4,5,1,2]',output:'1',explanation:'Minimum is 1 at index 3'}],
       hint:'Compare mid to the rightmost element to decide which half has the minimum.',approach:'Binary search: if nums[mid] > nums[hi], min is in right half. Else in left half (including mid).',leetcodeSlug:'find-minimum-in-rotated-sorted-array'},
      {id:'e22',title:'Integer Square Root',topic:'binary_search',
       statement:'Return the integer square root of x (floor of the actual square root) without using any built-in power function.',
       examples:[{input:'x=8',output:'2',explanation:'sqrt(8)≈2.82, floor=2'}],
       hint:'Binary search the answer between 0 and x.',approach:'Binary search: lo=0, hi=x. If mid*mid ≤ x, candidate answer is mid; search right. Else search left.',leetcodeSlug:'sqrtx'}
    ],
    medium: [
      {id:'m01',title:'3Sum',topic:'arrays',
       statement:'Find all unique triplets in the array that sum to zero. The solution set must not contain duplicate triplets.',
       examples:[{input:'[-1,0,1,2,-1,-4]',output:'[[-1,-1,2],[-1,0,1]]',explanation:'Two unique zero-sum triplets'}],
       hint:'Sort first, then fix one element and use two pointers.',approach:'Sort. For each element i, use two pointers lo=i+1 and hi=n-1. When sum > 0 move hi left; < 0 move lo right. Skip duplicates.',leetcodeSlug:'3sum'},
      {id:'m02',title:'Product of Array Except Self',topic:'arrays',
       statement:'Return an array where each element is the product of all other array elements. No division allowed; solve in O(n).',
       examples:[{input:'[1,2,3,4]',output:'[24,12,8,6]',explanation:'Product of all except self'}],
       hint:'Use prefix products from the left and suffix products from the right.',approach:'First pass: build left prefix products. Second pass: multiply each position by the suffix product, accumulated right-to-left.',leetcodeSlug:'product-of-array-except-self'},
      {id:'m03',title:'Longest Substring Without Repeating Characters',topic:'strings',
       statement:'Find the length of the longest substring with no repeating characters.',
       examples:[{input:'"abcabcbb"',output:'3',explanation:'"abc" is the longest unique substring'}],
       hint:'Use a sliding window with a set to track current window characters.',approach:'Expand right pointer; when a duplicate is found, shrink from the left until the duplicate is removed. Track max window size.',leetcodeSlug:'longest-substring-without-repeating-characters'},
      {id:'m04',title:'Group Anagrams',topic:'strings',
       statement:'Group strings that are anagrams of each other. Return all groups.',
       examples:[{input:'["eat","tea","tan","ate","nat","bat"]',output:'[["eat","tea","ate"],["tan","nat"],["bat"]]',explanation:'Anagrams grouped together'}],
       hint:'Sorted characters of anagrams are identical — use as HashMap key.',approach:'For each string, sort its characters to form a key. Group strings with the same key into the same list.',leetcodeSlug:'group-anagrams'},
      {id:'m05',title:'Top K Frequent Elements',topic:'hashing',
       statement:'Given an array, return the k most frequent elements. You may return the answer in any order.',
       examples:[{input:'[1,1,1,2,2,3], k=2',output:'[1,2]',explanation:'1 appears 3 times, 2 appears twice'}],
       hint:'Count frequencies with a HashMap; use bucket sort or a min-heap.',approach:'Build frequency map. Use bucket sort (array indexed by frequency) to collect top-k in O(n).',leetcodeSlug:'top-k-frequent-elements'},
      {id:'m06',title:'Encode and Decode Strings',topic:'strings',
       statement:'Design an algorithm to encode a list of strings to a single string and decode it back. The encoded string must be transmittable over network.',
       examples:[{input:'["lint","code","love","you"]',output:'encode then decode returns original list',explanation:'Custom delimiter handles all characters'}],
       hint:'Prefix each string with its length and a separator.',approach:'Encode: for each string, write len + "#" + string. Decode: read the number before "#" to know how many chars to read next.',leetcodeSlug:'encode-and-decode-strings'},
      {id:'m07',title:'Container With Most Water',topic:'arrays',
       statement:'Given n vertical lines, find two lines that together with the x-axis form a container holding the most water.',
       examples:[{input:'[1,8,6,2,5,4,8,3,7]',output:'49',explanation:'Lines at index 1 and 8, height min(8,7)=7, width 7'}],
       hint:'Move the shorter line inward — moving the taller line can only decrease the area.',approach:'Two pointers at both ends. Area = width * min(left, right). Move the shorter-height pointer inward each step.',leetcodeSlug:'container-with-most-water'},
      {id:'m08',title:'Jump Game',topic:'arrays',
       statement:'Each element is your maximum jump length from that position. Return true if you can reach the last index from index 0.',
       examples:[{input:'[2,3,1,1,4]',output:'true',explanation:'Jump 1 to index 1, then 3 to last index'}],
       hint:'Track the farthest reachable index as you scan.',approach:'Greedy: keep maxReach. At each index i, if i > maxReach you\'re stuck. Otherwise maxReach = max(maxReach, i + nums[i]).',leetcodeSlug:'jump-game'},
      {id:'m09',title:'Rotate Array',topic:'arrays',
       statement:'Rotate an array right by k steps in-place using O(1) extra space.',
       examples:[{input:'[1,2,3,4,5,6,7], k=3',output:'[5,6,7,1,2,3,4]',explanation:'3 right rotations'}],
       hint:'Three reversal trick: reverse all, reverse first k, reverse rest.',approach:'Reverse entire array. Reverse first k elements. Reverse remaining n-k. Total O(n) with O(1) space.',leetcodeSlug:'rotate-array'},
      {id:'m10',title:'Find All Duplicates in Array',topic:'arrays',
       statement:'Given an array of n integers where each value is between 1 and n, find all elements that appear exactly twice. O(n) time, O(1) extra space.',
       examples:[{input:'[4,3,2,7,8,2,3,1]',output:'[2,3]',explanation:'2 and 3 each appear twice'}],
       hint:'Use the array index as a hash — mark visited indices negative.',approach:'For each number, negate the value at index (abs(num)-1). If already negative, it\'s a duplicate.',leetcodeSlug:'find-all-duplicates-in-an-array'},
      {id:'m11',title:'Linked List Cycle Detection',topic:'linked_list',
       statement:'Given a linked list head, determine if the list contains a cycle. A cycle exists if some node\'s next pointer points to a previous node.',
       examples:[{input:'3→2→0→-4→(back to 2)',output:'true',explanation:'There is a cycle at node 2'}],
       hint:'Floyd\'s tortoise and hare — two pointers at different speeds.',approach:'Slow moves 1 step; fast moves 2 steps. If they meet, there\'s a cycle. If fast reaches null, no cycle.',leetcodeSlug:'linked-list-cycle'},
      {id:'m12',title:'LRU Cache',topic:'hashing',
       statement:'Design a data structure that follows the Least Recently Used cache eviction policy. Support get(key) and put(key,value) in O(1).',
       examples:[{input:'LRUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3) evicts 2',output:'get(2) returns -1',explanation:'Key 2 was least recently used'}],
       hint:'Combine a HashMap with a doubly-linked list for O(1) access and O(1) eviction.',approach:'HashMap for O(1) lookup; doubly-linked list to track recency. On access, move node to front. On eviction, remove tail.',leetcodeSlug:'lru-cache'},
      {id:'m13',title:'Binary Tree Level Order Traversal',topic:'trees',
       statement:'Return the level-order traversal of a binary tree\'s nodes\' values as a list of lists (each inner list is one level).',
       examples:[{input:'Tree: 3,9,20,null,null,15,7',output:'[[3],[9,20],[15,7]]',explanation:'Three levels of the tree'}],
       hint:'Use a queue and process all nodes at each level before moving to the next.',approach:'Queue-based BFS. At each level, record queue size, process exactly that many nodes, enqueue their children.',leetcodeSlug:'binary-tree-level-order-traversal'},
      {id:'m14',title:'Validate BST',topic:'trees',
       statement:'Determine if a binary tree is a valid binary search tree — left subtree < node < right subtree, recursively.',
       examples:[{input:'Tree: 5, left=1, right=4(with children 3,6)',output:'false',explanation:'Right child 4 < root 5'}],
       hint:'Each node has valid min and max bounds inherited from its ancestors.',approach:'Recursively pass (min, max) bounds. For left child, max = parent. For right child, min = parent. Validate each node.',leetcodeSlug:'validate-binary-search-tree'},
      {id:'m15',title:'Number of Islands',topic:'graphs',
       statement:'Given a 2D grid of \'1\' (land) and \'0\' (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent land cells.',
       examples:[{input:'[["1","1","0"],["1","1","0"],["0","0","1"]]',output:'2',explanation:'Two separate land masses'}],
       hint:'DFS/BFS from each unvisited land cell marks the entire island as visited.',approach:'Nested loops: when cell is \'1\', increment count and flood-fill (DFS) all connected \'1\'s to \'0\'. O(m*n).',leetcodeSlug:'number-of-islands'},
      {id:'m16',title:'Course Schedule',topic:'graphs',
       statement:'Given n courses and prerequisite pairs, return true if you can finish all courses (i.e. no circular dependency exists).',
       examples:[{input:'n=2, prerequisites=[[1,0]]',output:'true',explanation:'Take 0 first, then 1'}],
       hint:'Model as directed graph and detect cycles using DFS.',approach:'Build adjacency list. DFS with three states: unvisited, in-progress, done. If you reach an in-progress node, there\'s a cycle.',leetcodeSlug:'course-schedule'},
      {id:'m17',title:'Word Search',topic:'recursion',
       statement:'Given a 2D board of characters and a word, find if the word exists in the grid by sequentially adjacent cells (horizontal or vertical). No cell may be reused.',
       examples:[{input:'board with "ABCCED", word="ABCCED"',output:'true',explanation:'Word traced through the board'}],
       hint:'DFS with backtracking from each starting cell.',approach:'For each cell matching word[0], DFS in all 4 directions. Mark cell visited (e.g. \'#\'), recurse, then restore.',leetcodeSlug:'word-search'},
      {id:'m18',title:'Combination Sum',topic:'recursion',
       statement:'Given an array of distinct integers and a target, return all unique combinations that sum to target. Each number may be used unlimited times.',
       examples:[{input:'[2,3,6,7], target=7',output:'[[2,2,3],[7]]',explanation:'Two combinations sum to 7'}],
       hint:'Backtracking: at each step, include candidate or skip it.',approach:'Sort. Backtrack: try each candidate from current index onward. If sum equals target, record. If sum > target, prune.',leetcodeSlug:'combination-sum'},
      {id:'m19',title:'Subsets',topic:'recursion',
       statement:'Given a set of unique integers, return all possible subsets including the empty set.',
       examples:[{input:'[1,2,3]',output:'[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',explanation:'All 8 subsets of a 3-element set'}],
       hint:'At each element, you either include it or exclude it.',approach:'Start with [[]]. For each number, add it to every existing subset to generate new subsets.',leetcodeSlug:'subsets'},
      {id:'m20',title:'Decode Ways',topic:'recursion',
       statement:'A message is encoded as numbers (A=1, B=2 ... Z=26). Return the number of ways to decode a digit string.',
       examples:[{input:'"226"',output:'3',explanation:'"2,2,6"=BBF, "22,6"=VF, "2,26"=BZ'}],
       hint:'This is a DP problem — dp[i] depends on dp[i-1] and dp[i-2].',approach:'dp[i] = dp[i-1] if s[i] is valid + dp[i-2] if s[i-1..i] is a valid two-digit code (10-26). Handle \'0\' carefully.',leetcodeSlug:'decode-ways'},
      {id:'m21',title:'House Robber',topic:'arrays',
       statement:'Given house values in a line, find the maximum money you can rob without robbing two adjacent houses.',
       examples:[{input:'[1,2,3,1]',output:'4',explanation:'Rob house 1 (1) and house 3 (3)'}],
       hint:'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',approach:'Keep two variables: rob (include current) and skip (exclude current). Transition: newRob=skip+nums[i], newSkip=max(rob,skip).',leetcodeSlug:'house-robber'},
      {id:'m22',title:'Coin Change',topic:'arrays',
       statement:'Given an array of coin denominations and an amount, return the fewest coins needed to make up that amount, or -1 if impossible.',
       examples:[{input:'coins=[1,5,11], amount=15',output:'3',explanation:'11+1+1+1 = 4 coins, but 5+5+5=3 coins'}],
       hint:'dp[amount] = min coins needed. Build bottom-up.',approach:'dp[0]=0. For each amount a from 1 to target: dp[a] = min(dp[a - coin] + 1) over all valid coins. O(amount * coins).',leetcodeSlug:'coin-change'}
    ],
    hard: [
      {id:'h01',title:'Trapping Rain Water',topic:'arrays',
       statement:'Given an elevation map as heights, compute how much water it can trap after raining.',
       examples:[{input:'[0,1,0,2,1,0,1,3,2,1,2,1]',output:'6',explanation:'Total trapped water is 6 units'}],
       hint:'For each position, water trapped = min(maxLeft, maxRight) - height[i].',approach:'Two arrays: leftMax[i], rightMax[i]. Water at i = max(0, min(leftMax[i], rightMax[i]) - h[i]). Sum all.',leetcodeSlug:'trapping-rain-water'},
      {id:'h02',title:'Sliding Window Maximum',topic:'arrays',
       statement:'Given an array and window size k, return the maximum of each sliding window position.',
       examples:[{input:'[1,3,-1,-3,5,3,6,7], k=3',output:'[3,3,5,5,6,7]',explanation:'Max of each window of size 3'}],
       hint:'A monotonic deque maintains candidate maxima efficiently.',approach:'Use a deque of indices in decreasing order of values. Front is always the current window max. O(n) overall.',leetcodeSlug:'sliding-window-maximum'},
      {id:'h03',title:'Minimum Window Substring',topic:'strings',
       statement:'Find the minimum-length substring of s that contains all characters of t (including duplicates).',
       examples:[{input:'s="ADOBECODEBANC", t="ABC"',output:'"BANC"',explanation:'Smallest window containing A,B,C'}],
       hint:'Expand right to include all chars; shrink left to minimize window.',approach:'Sliding window with two HashMaps. Expand right until all t chars covered. Shrink left while still valid. Track min.',leetcodeSlug:'minimum-window-substring'},
      {id:'h04',title:'Largest Rectangle in Histogram',topic:'stack',
       statement:'Given an array of bar heights, find the area of the largest rectangle that fits entirely within the histogram.',
       examples:[{input:'[2,1,5,6,2,3]',output:'10',explanation:'Rectangle spanning bars of height 5 and 6'}],
       hint:'A monotonic stack tracks bars that are potential left boundaries.',approach:'Stack stores indices in increasing height order. When a shorter bar is found, pop and calculate area with popped bar as height.',leetcodeSlug:'largest-rectangle-in-histogram'},
      {id:'h05',title:'Serialize and Deserialize Binary Tree',topic:'trees',
       statement:'Design an algorithm to serialize a binary tree to a string and deserialize it back to the original tree structure.',
       examples:[{input:'Tree: [1,2,3,null,null,4,5]',output:'serialized and perfectly reconstructed',explanation:'Any encoding that reconstructs the original works'}],
       hint:'Preorder traversal with null markers encodes structure.',approach:'Serialize: preorder DFS, record null as "#". Deserialize: preorder recursion consuming tokens one by one from a queue.',leetcodeSlug:'serialize-and-deserialize-binary-tree'},
      {id:'h06',title:'Binary Tree Maximum Path Sum',topic:'trees',
       statement:'Find the maximum sum of any path in a binary tree. A path is any sequence of nodes where each consecutive pair is connected by an edge.',
       examples:[{input:'Tree: -10, left=9, right=20(15,7)',output:'42',explanation:'Path 15→20→7 has sum 42'}],
       hint:'At each node, consider four path types: node alone, through left, through right, through both.',approach:'DFS: each node returns the max gain from its subtree (one direction). Globally track the best path (possibly both directions).',leetcodeSlug:'binary-tree-maximum-path-sum'},
      {id:'h07',title:'Kth Largest Element in a Stream',topic:'trees',
       statement:'Design a class to find the kth largest element in a stream. Every time a new integer is added, return the kth largest.',
       examples:[{input:'k=3, stream=[4,5,8,2]; add(3)→4, add(5)→5, add(10)→5',output:'returns kth largest after each add',explanation:'Min-heap of size k tracks top-k elements'}],
       hint:'A min-heap of size k keeps the top-k elements; heap top is the kth largest.',approach:'Maintain a min-heap of size k. On add: push value, if size>k pop smallest. Return heap top.',leetcodeSlug:'kth-largest-element-in-a-stream'},
      {id:'h08',title:'Alien Dictionary',topic:'graphs',
       statement:'Given a sorted alien dictionary wordlist, determine the order of characters in the alien language.',
       examples:[{input:'["wrt","wrf","er","ett","rftt"]',output:'"wertf"',explanation:'Order derived from adjacent word comparisons'}],
       hint:'Compare adjacent words to extract character-order edges, then topological sort.',approach:'Build graph of char→char edges from adjacent word comparisons. Run topological sort (BFS/Kahn\'s). Check for cycles.',leetcodeSlug:'alien-dictionary'},
      {id:'h09',title:'Graph Valid Tree',topic:'graphs',
       statement:'Given n nodes and a list of undirected edges, determine if the edges form a valid tree (connected, no cycles).',
       examples:[{input:'n=5, edges=[[0,1],[0,2],[0,3],[1,4]]',output:'true',explanation:'5 nodes, 4 edges, connected, no cycles'}],
       hint:'A valid tree has exactly n-1 edges and is fully connected.',approach:'Check edges count = n-1. Then BFS/DFS to verify all nodes reachable. Or use Union-Find — merge and check for cycles.',leetcodeSlug:'graph-valid-tree'},
      {id:'h10',title:'Word Ladder',topic:'graphs',
       statement:'Transform beginWord into endWord by changing one letter at a time. Each intermediate word must exist in the wordList. Return the shortest transformation sequence length.',
       examples:[{input:'begin="hit", end="cog", dict=["hot","dot","dog","lot","log","cog"]',output:'5',explanation:'hit→hot→dot→dog→cog (length 5)'}],
       hint:'BFS guarantees the shortest path in an unweighted graph.',approach:'BFS from beginWord. At each step, try all single-character mutations. If the mutation is in wordSet, enqueue it. Stop at endWord.',leetcodeSlug:'word-ladder'},
      {id:'h11',title:'Palindrome Partitioning',topic:'recursion',
       statement:'Partition a string such that every substring of the partition is a palindrome. Return all possible palindrome partitioning.',
       examples:[{input:'"aab"',output:'[["a","a","b"],["aa","b"]]',explanation:'Two valid palindrome partitionings'}],
       hint:'Backtrack: at each index, try all prefix substrings that are palindromes.',approach:'DFS + backtracking. For each start index, check all substrings s[start..i]. If palindrome, recurse from i+1.',leetcodeSlug:'palindrome-partitioning'},
      {id:'h12',title:'Regular Expression Matching',topic:'recursion',
       statement:'Implement regex matching with . (match any character) and * (match zero or more of the preceding element).',
       examples:[{input:'s="aa", p="a*"',output:'true',explanation:'a* matches zero or more a\'s'}],
       hint:'Recursion or DP with memoization on (i, j) position pairs.',approach:'dp[i][j] = does p[0..j] match s[0..i]. Handle \'*\': if p[j]===\'*\', dp[i][j] = dp[i][j-2] OR (match(s[i],p[j-1]) AND dp[i-1][j]).',leetcodeSlug:'regular-expression-matching'},
      {id:'h13',title:'Edit Distance',topic:'arrays',
       statement:'Given two strings, return the minimum number of insertions, deletions, or substitutions needed to convert word1 into word2.',
       examples:[{input:'"horse", "ros"',output:'3',explanation:'horse→rorse→rose→ros (3 operations)'}],
       hint:'Classic 2D DP — dp[i][j] = edit distance of s1[0..i] and s2[0..j].',approach:'If s1[i]=s2[j]: dp[i][j]=dp[i-1][j-1]. Else: dp[i][j]=1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',leetcodeSlug:'edit-distance'},
      {id:'h14',title:'Burst Balloons',topic:'arrays',
       statement:'Given n balloons with numbers, burst them all to maximize coins. Bursting balloon i gives nums[i-1]*nums[i]*nums[i+1] coins.',
       examples:[{input:'[3,1,5,8]',output:'167',explanation:'Optimal burst order gives 167 coins'}],
       hint:'Think about which balloon to burst LAST in a subrange, not first.',approach:'Interval DP: dp[l][r] = max coins from bursting all balloons between l and r. Try each as the last to burst.',leetcodeSlug:'burst-balloons'},
      {id:'h15',title:'Maximum Profit in Job Scheduling',topic:'sorting',
       statement:'Given jobs with start time, end time, and profit, find the maximum total profit from a subset of non-overlapping jobs.',
       examples:[{input:'start=[1,2,3,3], end=[3,4,5,6], profit=[50,10,40,70]',output:'120',explanation:'Jobs 1 and 4 give 50+70=120'}],
       hint:'Sort by end time. DP with binary search to find the latest non-overlapping job.',approach:'Sort by end. dp[i] = max(dp[i-1], profit[i] + dp[latest non-overlapping job]). Use binary search for last non-overlap.',leetcodeSlug:'maximum-profit-in-job-scheduling'},
      {id:'h16',title:'Count of Smaller Numbers After Self',topic:'sorting',
       statement:'For each element in an array, count how many elements to the right are strictly smaller. Return the counts array.',
       examples:[{input:'[5,2,6,1]',output:'[2,1,1,0]',explanation:'5 has 2 smaller to right; 2 has 1; 6 has 1; 1 has 0'}],
       hint:'Merge sort while counting inversions, or use a Fenwick tree.',approach:'Modified merge sort: during merge, whenever right element is placed, count how many left elements are greater.',leetcodeSlug:'count-of-smaller-numbers-after-self'}
    ]
  };

  /* ── Deterministic daily selection ────────────────────── */
  function getDailyProblems(dateStr) {
    var parts = dateStr.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]), d = parseInt(parts[2]);
    var seed = y * 365 + m * 31 + d;
    return {
      easy:   PROBLEM_BANK.easy[   (seed * 1013) % PROBLEM_BANK.easy.length],
      medium: PROBLEM_BANK.medium[ (seed * 1499) % PROBLEM_BANK.medium.length],
      hard:   PROBLEM_BANK.hard[   (seed * 1999) % PROBLEM_BANK.hard.length]
    };
  }

  function todayStr() { return new Date().toISOString().slice(0, 10); }

  /* ── State helpers ─────────────────────────────────────── */
  function getSolvedToday(s) {
    var key = todayStr();
    return (s.dailyChallenges && s.dailyChallenges[key]) || { easy: false, medium: false, hard: false };
  }

  function getStats(s) {
    var dc = s.dailyChallenges || {};
    var total = 0, byD = { easy:0, medium:0, hard:0 };
    Object.keys(dc).forEach(function (date) {
      ['easy','medium','hard'].forEach(function (d) { if (dc[date][d]) { total++; byD[d]++; } });
    });
    return { total: total, byD: byD, streak: s.dailyChallengeStreak || 0 };
  }

  /* ── XP award (defensive) ──────────────────────────────── */
  function awardXP(s, reason) {
    if (window.SHIBI && SHIBI.Gamify && SHIBI.Gamify.addXP) SHIBI.Gamify.addXP(s, 20, reason);
    else SHIBI.Utils.toast('+20 XP · Challenge solved!');
  }

  /* ── Mark solved ───────────────────────────────────────── */
  function markSolved(s, difficulty) {
    var key = todayStr();
    if (!s.dailyChallenges) s.dailyChallenges = {};
    if (!s.dailyChallenges[key]) s.dailyChallenges[key] = {};
    if (s.dailyChallenges[key][difficulty]) return; // already solved

    s.dailyChallenges[key][difficulty] = true;

    // Streak logic
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    var yKey = yesterday.toISOString().slice(0, 10);
    if (s.dailyChallengeLast === yKey) {
      s.dailyChallengeStreak = (s.dailyChallengeStreak || 0) + 1;
    } else if (s.dailyChallengeLast !== key) {
      s.dailyChallengeStreak = 1;
    }
    s.dailyChallengeLast = key;

    SHIBI.State.markStudy(s);
    SHIBI.State.save(s);
    awardXP(s, 'Daily challenge: ' + difficulty);
    render(s);
  }

  /* ── Toggle hint/approach visibility ──────────────────── */
  function toggleBlock(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('visible');
  }

  /* ── Week strip ────────────────────────────────────────── */
  function buildWeekStrip(s) {
    var days = ['M','T','W','T','F','S','S'];
    var today = new Date(); today.setHours(0,0,0,0);
    // find Monday
    var mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    var html = '<div class="week-strip">';
    for (var i = 0; i < 7; i++) {
      var d = new Date(mon); d.setDate(mon.getDate() + i);
      var ds = d.toISOString().slice(0,10);
      var dayData = s.dailyChallenges && s.dailyChallenges[ds];
      var solved  = dayData && (dayData.easy || dayData.medium || dayData.hard);
      var isToday = (ds === todayStr());
      html += '<div class="week-day-cell' + (isToday ? ' today' : '') + '">' +
        '<span>' + days[i] + '</span>' +
        '<span class="week-dot' + (solved ? ' active' : '') + '"></span>' +
      '</div>';
    }
    return html + '</div>';
  }

  /* ── Topic bars ────────────────────────────────────────── */
  function buildTopicBars(s) {
    var byTopic = {};
    var dc = s.dailyChallenges || {};
    var all = [].concat(PROBLEM_BANK.easy, PROBLEM_BANK.medium, PROBLEM_BANK.hard);
    // Count solved problems per topic from today's selections (simple approximation)
    Object.keys(dc).forEach(function (date) {
      var probs = getDailyProblems(date);
      ['easy','medium','hard'].forEach(function (diff) {
        if (dc[date][diff] && probs[diff]) {
          var t = probs[diff].topic;
          byTopic[t] = (byTopic[t] || 0) + 1;
        }
      });
    });
    var topics = Object.keys(byTopic).sort(function (a,b) { return byTopic[b]-byTopic[a]; });
    if (!topics.length) return '<p class="text-muted-soft" style="font-size:12px">No topics solved yet.</p>';
    var max = byTopic[topics[0]] || 1;
    return topics.slice(0,8).map(function (t) {
      var pct = Math.round((byTopic[t] / max) * 100);
      return '<div class="topic-bar-row">' +
        '<span class="topic-bar-label">' + SHIBI.Utils.escapeHtml(t) + '</span>' +
        '<div class="topic-bar-track progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="badge-soft" style="font-size:11px">' + byTopic[t] + '</span>' +
      '</div>';
    }).join('');
  }

  /* ── Challenge card HTML ───────────────────────────────── */
  function challengeCard(problem, difficulty, solved) {
    var diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    var diffCls   = { easy:'easy', medium:'med', hard:'hard' }[difficulty] || 'med';
    var id        = 'card_' + difficulty;

    return '<div class="challenge-card glass diff-' + diffCls + (solved ? ' solved' : '') + '" id="' + id + '">' +
      '<div class="challenge-header">' +
        '<span class="diff-tag ' + diffCls + '">' + diffLabel + '</span>' +
        '<span class="badge-soft" style="font-size:11px">' + SHIBI.Utils.escapeHtml(problem.topic) + '</span>' +
        (solved ? '<span class="solved-badge">✓ Solved</span>' : '') +
        (problem.leetcodeSlug ? '<a href="https://leetcode.com/problems/' + SHIBI.Utils.escapeAttr(problem.leetcodeSlug) + '/" target="_blank" rel="noopener" class="mini-btn outline" style="padding:4px 8px;font-size:11px"><i class="bi bi-box-arrow-up-right"></i> LC</a>' : '') +
      '</div>' +
      '<div class="challenge-title">' + SHIBI.Utils.escapeHtml(problem.title) + '</div>' +
      '<p style="font-size:13px;color:var(--text-mute);margin:0 0 10px">' + SHIBI.Utils.escapeHtml(problem.statement) + '</p>' +
      problem.examples.map(function (ex) {
        return '<div class="example-block"><strong>Input:</strong> ' + SHIBI.Utils.escapeHtml(ex.input) + '<br>' +
          '<strong>Output:</strong> ' + SHIBI.Utils.escapeHtml(ex.output) + '<br>' +
          '<small style="color:var(--text-dim)">' + SHIBI.Utils.escapeHtml(ex.explanation) + '</small></div>';
      }).join('') +
      '<div id="hint_' + difficulty + '" class="hint-block">' +
        '<i class="bi bi-lightbulb-fill" style="color:var(--accent-yellow)"></i> <strong>Hint:</strong> ' + SHIBI.Utils.escapeHtml(problem.hint) + '</div>' +
      '<div id="approach_' + difficulty + '" class="approach-block">' +
        '<i class="bi bi-diagram-2-fill" style="color:var(--accent)"></i> <strong>Approach:</strong> ' + SHIBI.Utils.escapeHtml(problem.approach) + '</div>' +
      '<div class="d-flex gap-2 mt-3 flex-wrap">' +
        (solved
          ? '<button class="mini-btn outline" disabled style="color:var(--accent-green);border-color:var(--accent-green)"><i class="bi bi-check-circle-fill"></i> Solved!</button>'
          : '<button class="mini-btn primary" data-action="solve" data-diff="' + difficulty + '"><i class="bi bi-check-lg"></i> Mark Solved</button>') +
        '<button class="mini-btn outline" data-action="hint" data-diff="' + difficulty + '">💡 Hint</button>' +
        '<button class="mini-btn outline" data-action="approach" data-diff="' + difficulty + '">🧠 Approach</button>' +
      '</div>' +
    '</div>';
  }

  /* ── Main render ───────────────────────────────────────── */
  function render(s) {
    var container = document.getElementById('dailyChallengeContent');
    if (!container) return;

    var today    = todayStr();
    var problems = getDailyProblems(today);
    var solved   = getSolvedToday(s);
    var stats    = getStats(s);
    var fmtDate  = new Date().toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

    container.innerHTML =
      // Stats row
      '<div class="row g-3 kpi-row mb-3">' +
        kpi(stats.total,        'Total Solved', 'bi-code-square') +
        kpi(stats.byD.easy,     'Easy',         'bi-circle',       'var(--accent-green)') +
        kpi(stats.byD.medium,   'Medium',       'bi-circle-half',  'var(--accent-yellow)') +
        kpi(stats.byD.hard,     'Hard',         'bi-circle-fill',  'var(--accent-red)') +
        kpi(stats.streak,       'Streak 🔥',    'bi-fire',         'var(--accent-yellow)') +
      '</div>' +

      // Date strip
      '<div class="panel glass mb-3" style="padding:12px 18px">' +
        '<span style="font-family:var(--font-mono);font-size:12px;color:var(--text-mute)">' + fmtDate + '</span>' +
        '<span class="badge-soft ms-2">' + [solved.easy, solved.medium, solved.hard].filter(Boolean).length + '/3 today</span>' +
      '</div>' +

      // Three challenge cards
      challengeCard(problems.easy,   'easy',   solved.easy) +
      challengeCard(problems.medium, 'medium', solved.medium) +
      challengeCard(problems.hard,   'hard',   solved.hard) +

      // Week strip
      '<div class="panel glass mt-3 p-3">' +
        '<div class="panel-head" style="margin-bottom:4px"><h3 style="font-size:13px">This Week</h3></div>' +
        buildWeekStrip(s) +
      '</div>' +

      // Topic breakdown
      '<div class="panel glass mt-3">' +
        '<div class="panel-head"><h3><i class="bi bi-bar-chart-fill"></i> Topic Breakdown</h3></div>' +
        '<div style="padding:4px 8px 12px">' + buildTopicBars(s) + '</div>' +
      '</div>';

    // FIX BUG-05: use persistent event delegation (NOT { once:true }) so hint/approach/solve
    // all work independently. Remove old listener first to avoid duplicates on re-render.
    if (container._challengeHandler) {
      container.removeEventListener('click', container._challengeHandler);
    }
    container._challengeHandler = function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.dataset.action;
      var diff   = btn.dataset.diff;
      if (action === 'solve')    markSolved(s, diff);
      if (action === 'hint')     toggleBlock('hint_' + diff);
      if (action === 'approach') toggleBlock('approach_' + diff);
    };
    container.addEventListener('click', container._challengeHandler);
  }

  function kpi(val, label, icon, color) {
    return '<div class="col-6 col-md"><div class="kpi-card glass">' +
      '<div class="kpi-icon"' + (color ? ' style="color:' + color + '"' : '') + '><i class="bi ' + icon + '"></i></div>' +
      '<div class="kpi-val" style="font-size:22px">' + val + '</div>' +
      '<div class="kpi-label">' + label + '</div>' +
    '</div></div>';
  }

  function init(s) { render(s); }

  return { init, render, markSolved };
})();
// Backward-compat alias — must be set AFTER IIFE assigns window.SHIBI.Challenge
window.SHIBI.DailyChallenge = window.SHIBI.Challenge;
