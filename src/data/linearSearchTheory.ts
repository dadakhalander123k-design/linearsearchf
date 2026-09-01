export interface MultiLangCode {
  c: string;
  cpp: string;
  java: string;
  python: string;
}

export interface CodeExplanationLine {
  lineNum: string;
  code: string;
  explanation: string;
}

export interface LinearSearchModule {
  id: string; // 'theory-01' to 'theory-12'
  number: string; // '01' to '12'
  category: string;
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  analogyTitle?: string;
  analogyContent?: string;
  csApplications?: string[];
  coreTopics?: string[];
  executionSteps?: {
    step: number;
    index: number;
    value: number;
    target: number;
    comparison: string;
    result: string;
    isMatch: boolean;
  }[];
  pseudocode?: string;
  complexityDerivation?: {
    caseType: string;
    complexity: string;
    description: string;
    formula: string;
  }[];
  derivationTable?: {
    size: string;
    best: string;
    avg: string;
    worst: string;
  }[];
  spaceAnalysis?: {
    type: string;
    complexity: string;
    details: string;
  }[];
  advantages?: {
    title: string;
    description: string;
    tag: string;
  }[];
  disadvantages?: {
    title: string;
    description: string;
    impact: string;
  }[];
  decisionCriteria?: {
    scenario: string;
    recommendation: 'Use Linear Search' | 'Avoid / Use Alternative';
    rationale: string;
  }[];
  edgeCases?: {
    scenario: string;
    input: string;
    behavior: string;
    output: string;
  }[];
  comparisonMatrix?: {
    feature: string;
    linearSearch: string;
    binarySearch: string;
  }[];
  masterRulebook?: string[];
  codeSnippets: MultiLangCode;
  codeExplanations: CodeExplanationLine[];
  keyFormula?: string;
  keyFormulaLabel?: string;
  keyTakeaway: string;
}

export const LINEAR_SEARCH_MODULES: LinearSearchModule[] = [
  // =========================================================================
  // MODULE 01: WHAT IS LINEAR SEARCH?
  // =========================================================================
  {
    id: 'theory-01',
    number: '01',
    category: 'FUNDAMENTALS',
    title: 'What is Linear Search?',
    subtitle: 'Core Definition, Intuition & Fundamental Mechanics',
    readTime: '~3 min read',
    summary:
      'Linear Search (also known as Sequential Search) is the most fundamental searching algorithm in Computer Science. It inspects every element in a list one by one until a match is found or the collection ends.',
    analogyTitle: 'Searching for a Key in a Keyring',
    analogyContent:
      'You hold a keyring with multiple keys. To open a lock, you try the first key, then the second, then the third, continuing sequentially until one turns the lock.',
    csApplications: [
      'Scanning an unsorted list of contacts on a phone.',
      'Finding a student’s name in an unorganized attendance sheet.',
      'Searching for a specific word in an unindexed text document.',
    ],
    coreTopics: [
      'Mathematical definition of searching problems: Given an array A[0 ... n-1], find index i where A[i] == T for target key T.',
      'Zero Prerequisites: Operates directly on raw, unsorted data without prior preparation or memory overhead.',
      'Return Value Convention: Returns 0-based index i on success, or -1 (or null/None) on failure.',
    ],
    keyFormula: 'Search Problem: Find i ∈ [0, n-1] such that A[i] = Target, else return -1',
    keyFormulaLabel: 'FORMAL SEARCH CRITERIA',
    keyTakeaway: 'Linear Search is universal, intuitive, and requires no pre-sorting.',
    codeSnippets: {
      c: `// C implementation of Linear Search
#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found target at index i
        }
    }
    return -1; // Target not found
}`,
      cpp: `// C++ modern vector implementation
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) {
            return static_cast<int>(i); // Match found
        }
    }
    return -1; // Not present
}`,
      java: `// Java static search method
public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Return 0-based index
            }
        }
        return -1; // Element not found
    }
}`,
      python: `# Python sequential search function
def linear_search(arr: list, target: int) -> int:
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Early exit on match
    return -1  # Not found`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'def linear_search(arr, target):', explanation: 'Defines the function accepting the input array and search target key.' },
      { lineNum: '2', code: 'for i in range(len(arr)):', explanation: 'Initiates a sequential loop from index 0 to n - 1.' },
      { lineNum: '3', code: 'if arr[i] == target:', explanation: 'Compares the current element with target value.' },
      { lineNum: '4', code: 'return i', explanation: 'Immediately returns index upon finding a match (early termination).' },
      { lineNum: '5', code: 'return -1', explanation: 'Safely returns -1 if the loop finishes without finding the target.' },
    ],
  },

  // =========================================================================
  // MODULE 02: HOW LINEAR SEARCH WORKS
  // =========================================================================
  {
    id: 'theory-02',
    number: '02',
    category: 'ALGORITHM MECHANICS',
    title: 'How Linear Search Works',
    subtitle: 'Step-by-Step Traversal & Element Comparison',
    readTime: '~4 min read',
    summary:
      'Linear search sequentially evaluates each array slot from index 0 to n - 1.',
    analogyTitle: 'Finding a Book on an Unsorted Shelf',
    analogyContent:
      'You examine book titles from the leftmost book to the rightmost book until you find the exact title you need.',
    coreTopics: [
      '1. Initialize pointer i = 0.',
      '2. Check termination condition i < n.',
      '3. Compare current value arr[i] == target.',
      '4. If matched, immediately return i (early exit).',
      '5. If not matched, increment pointer i = i + 1 and repeat.',
      '6. If loop completes without match, return -1.',
    ],
    csApplications: [
      'Traversing contiguous memory buffers element by element.',
      'Short-circuit evaluation in stream parsers.',
      'Sequential validation of input parameters.',
    ],
    keyFormula: 'Step Pipeline: i = 0 → Check (i < n) → Compare arr[i] == T → [Match ? Return i : i++]',
    keyFormulaLabel: 'SEQUENTIAL SCANNING PIPELINE',
    keyTakeaway: 'Early termination ensures optimal efficiency when the target is located near the front.',
    codeSnippets: {
      c: `int linearSearch(int arr[], int n, int target) {
    int i = 0;
    while (i < n) {
        if (arr[i] == target) return i;
        i++;
    }
    return -1;
}`,
      cpp: `int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); ++i) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      java: `public static int search(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      python: `def linear_search(arr, target):
    i = 0
    n = len(arr)
    while i < n:
        if arr[i] == target:
            return i
        i += 1
    return -1`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'i = 0', explanation: 'Starts execution at index 0 of the collection.' },
      { lineNum: '2', code: 'while i < n:', explanation: 'Ensures traversal does not exceed array bounds.' },
      { lineNum: '3', code: 'if arr[i] == target: return i', explanation: 'Checks equality and returns index on match.' },
      { lineNum: '4', code: 'i += 1', explanation: 'Increments the pointer to inspect the next adjacent element.' },
      { lineNum: '5', code: 'return -1', explanation: 'Indicates target is absent after exhaustive scan.' },
    ],
  },

  // =========================================================================
  // MODULE 03: DETAILED STEP-BY-STEP TRACE
  // =========================================================================
  {
    id: 'theory-03',
    number: '03',
    category: 'EXECUTION TRACE',
    title: 'Detailed Step-by-Step Trace',
    subtitle: 'Concrete Tracing Through an Array [12, 45, 78, 23, 56]',
    readTime: '~4 min read',
    summary:
      'A thorough execution trace showing the exact state of variables, comparisons, and pointer movements at every step.',
    analogyTitle: 'Checking Items on a Grocery Receipt',
    analogyContent:
      'To verify if you were billed for milk, you check item 1 (apples), item 2 (bread), item 3 (cheese), item 4 (milk - match!). You stop reading immediately once found.',
    executionSteps: [
      { step: 1, index: 0, value: 12, target: 23, comparison: '12 == 23', result: 'Mismatch (False)', isMatch: false },
      { step: 2, index: 1, value: 45, target: 23, comparison: '45 == 23', result: 'Mismatch (False)', isMatch: false },
      { step: 3, index: 2, value: 78, target: 23, comparison: '78 == 23', result: 'Mismatch (False)', isMatch: false },
      { step: 4, index: 3, value: 23, target: 23, comparison: '23 == 23', result: 'MATCH FOUND! Return index 3', isMatch: true },
    ],
    csApplications: [
      'GDB and debugger stepping for array boundary verification.',
      'Unit testing edge cases in search routines.',
      'Understanding loop invariant assertions.',
    ],
    keyFormula: 'Trace Matrix: Array = [12, 45, 78, 23, 56], Target = 23 ⇒ Evaluates slots 0, 1, 2, 3 (4 comparisons)',
    keyFormulaLabel: 'CONCRETE TRACE SUMMARY',
    keyTakeaway: 'Tracing execution step-by-step reinforces algorithmic flow and index tracking.',
    codeSnippets: {
      c: `// Trace Demo: Target = 23
int data[] = {12, 45, 78, 23, 56};
int idx = linearSearch(data, 5, 23); // returns 3`,
      cpp: `// Trace Demo: Target = 23
std::vector<int> data = {12, 45, 78, 23, 56};
int idx = linearSearch(data, 23); // returns 3`,
      java: `// Trace Demo: Target = 23
int[] data = {12, 45, 78, 23, 56};
int idx = LinearSearch.search(data, 23); // returns 3`,
      python: `# Trace Demo: Target = 23
data = [12, 45, 78, 23, 56]
idx = linear_search(data, 23)  # returns 3`,
    },
    codeExplanations: [
      { lineNum: 'Step 1', code: 'arr[0] = 12 ≠ 23', explanation: 'Pointer at i=0: 12 is not 23, continue.' },
      { lineNum: 'Step 2', code: 'arr[1] = 45 ≠ 23', explanation: 'Pointer at i=1: 45 is not 23, continue.' },
      { lineNum: 'Step 3', code: 'arr[2] = 78 ≠ 23', explanation: 'Pointer at i=2: 78 is not 23, continue.' },
      { lineNum: 'Step 4', code: 'arr[3] = 23 == 23', explanation: 'Pointer at i=3: 23 matches target 23! Returns 3.' },
    ],
  },

  // =========================================================================
  // MODULE 04: PSEUDOCODE & ALGORITHMIC LOGIC
  // =========================================================================
  {
    id: 'theory-04',
    number: '04',
    category: 'PSEUDOCODE & LOGIC',
    title: 'Pseudocode & Algorithmic Logic',
    subtitle: 'Formal Algorithmic Steps and Condition Handling',
    readTime: '~3 min read',
    summary:
      'Formalizes the logic into language-agnostic pseudocode and mathematical flow steps.',
    analogyTitle: 'A Standard Cooking Recipe',
    analogyContent:
      'A recipe lists concise, clear instructions step-by-step that anyone can follow in any kitchen, regardless of the brand of stove they use.',
    pseudocode: `Algorithm: LinearSearch(A, n, target)
Input: Array A of size n, target value
Output: Index of target in A, or -1 if not found

1. For i ← 0 to n - 1 do:
2.     If A[i] == target then:
3.         Return i
4. End For
5. Return -1`,
    coreTopics: [
      'Formalization: Separates logical flow from specific language syntax quirks.',
      'Loop Invariant: At the start of iteration i, target is guaranteed not to exist in A[0 ... i-1].',
      'Safe Failure Exit: Guaranteed return of -1 prevents out-of-bounds undefined behavior.',
    ],
    csApplications: [
      'Technical specification documents and whitepapers.',
      'Academic algorithm proofs and invariants.',
      'Standardized interview problem communication.',
    ],
    keyFormula: 'Invariant: ∀ j ∈ [0, i-1], A[j] ≠ target',
    keyFormulaLabel: 'ALGORITHM LOOP INVARIANT',
    keyTakeaway: 'Pseudocode bridges human thought and syntactical programming languages.',
    codeSnippets: {
      c: `/* Formal Pseudocode translated to C */
int LinearSearch(int A[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (A[i] == target) {
            return i;
        }
    }
    return -1;
}`,
      cpp: `/* Formal Pseudocode translated to C++ */
int LinearSearch(const std::vector<int>& A, int target) {
    for (int i = 0; i < (int)A.size(); i++) {
        if (A[i] == target) return i;
    }
    return -1;
}`,
      java: `/* Formal Pseudocode translated to Java */
public static int LinearSearch(int[] A, int target) {
    for (int i = 0; i < A.length; i++) {
        if (A[i] == target) return i;
    }
    return -1;
}`,
      python: `# Formal Pseudocode translated to Python
def linear_search(A, target):
    for i in range(len(A)):
        if A[i] == target:
            return i
    return -1`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'For i ← 0 to n - 1 do:', explanation: 'Sets loop bounds across the entire collection size n.' },
      { lineNum: '2', code: 'If A[i] == target then:', explanation: 'Performs element comparison against target.' },
      { lineNum: '3', code: 'Return i', explanation: 'Returns target location immediately.' },
      { lineNum: '4', code: 'Return -1', explanation: 'Executes only when loop reaches termination without match.' },
    ],
  },

  // =========================================================================
  // MODULE 05: TIME COMPLEXITY ANALYSIS
  // =========================================================================
  {
    id: 'theory-05',
    number: '05',
    category: 'ASYMPTOTIC ANALYSIS',
    title: 'Time Complexity Analysis',
    subtitle: 'Best Case, Average Case, and Worst Case Breakdown',
    readTime: '~5 min read',
    summary:
      'Mathematical derivation and asymptotic analysis using Big-O notation.',
    analogyTitle: 'Searching for a Lost TV Remote',
    analogyContent:
      'Best Case: You look on the coffee table and find it immediately (1 check). Average Case: You check a few cushions before finding it (~halfway). Worst Case: You check under every sofa cushion, table, and shelf before finding it in the last spot (or not at all).',
    complexityDerivation: [
      {
        caseType: 'Best Case',
        complexity: 'O(1)',
        description: 'Target is at index 0. Found on the very first comparison.',
        formula: 'T(n) = 1 comparison = O(1)',
      },
      {
        caseType: 'Average Case',
        complexity: 'O(n)',
        description: 'Target is located uniformly at random across all slots.',
        formula: 'T(n) = (n + 1) / 2 comparisons ≈ O(n)',
      },
      {
        caseType: 'Worst Case',
        complexity: 'O(n)',
        description: 'Target is at the last index (n - 1) or completely absent.',
        formula: 'T(n) = n comparisons = O(n)',
      },
    ],
    derivationTable: [
      { size: 'n = 10', best: '1', avg: '5.5', worst: '10' },
      { size: 'n = 1,000', best: '1', avg: '500.5', worst: '1,000' },
      { size: 'n = 1,000,000', best: '1', avg: '500,000.5', worst: '1,000,000' },
    ],
    csApplications: [
      'Predicting response latency on expanding datasets.',
      'Setting SLA timeout boundaries for unindexed queries.',
      'Deciding when to transition from arrays to hash maps.',
    ],
    keyFormula: 'T_avg(n) = ∑ (i / n) = (n + 1) / 2 = O(n) | T_worst(n) = n = O(n)',
    keyFormulaLabel: 'ASYMPTOTIC TIME COMPLEXITY EQUATIONS',
    keyTakeaway: 'Execution time grows strictly linearly with the number of elements in the collection.',
    codeSnippets: {
      c: `// Best: O(1) when target is arr[0]
// Worst: O(n) when target is arr[n-1] or absent
int linearSearch(int arr[], int n, int target);`,
      cpp: `// Time complexity: O(n) worst/average, O(1) best
int linearSearch(const std::vector<int>& arr, int target);`,
      java: `// O(1) best, O(n) average/worst
public static int search(int[] arr, int target);`,
      python: `# O(1) best case (first element)
# O(n) worst case (last element or absent)
def linear_search(arr, target): ...`,
    },
    codeExplanations: [
      { lineNum: 'Best', code: 'arr[0] == target', explanation: '1 single comparison executed → O(1) time.' },
      { lineNum: 'Avg', code: 'arr[n/2] == target', explanation: 'On average requires (n + 1) / 2 comparisons → O(n) time.' },
      { lineNum: 'Worst', code: 'arr[n-1] or absent', explanation: 'Must inspect all n items → O(n) time.' },
    ],
  },

  // =========================================================================
  // MODULE 06: SPACE COMPLEXITY ANALYSIS
  // =========================================================================
  {
    id: 'theory-06',
    number: '06',
    category: 'MEMORY ANALYSIS',
    title: 'Space Complexity Analysis',
    subtitle: 'Auxiliary Memory, In-Place Traversal & Memory Footprint',
    readTime: '~3 min read',
    summary:
      'Evaluates memory consumption, auxiliary memory allocation, and call stack overhead.',
    analogyTitle: 'Reading a Book with Your Finger',
    analogyContent:
      'As you read line-by-line looking for a quote, you only use your finger as a marker. You do not need a notebook to copy the pages, so your extra memory used is constant.',
    spaceAnalysis: [
      {
        type: 'Auxiliary Space',
        complexity: 'O(1) (Constant)',
        details: 'Only a single loop counter variable (int i) is allocated on the stack.',
      },
      {
        type: 'Total Space',
        complexity: 'O(n) (Linear)',
        details: 'O(n) memory stores the input array itself, but the algorithm creates zero copies.',
      },
      {
        type: 'In-Place Traversal',
        complexity: 'O(1) Extra RAM',
        details: 'The input collection is never cloned, resized, or modified in memory.',
      },
    ],
    coreTopics: [
      'Zero Dynamic Memory: No malloc(), new, or heap allocation during execution.',
      'Iterative vs Recursive: Iterative linear search uses O(1) stack space; recursive variant consumes O(n) call stack frames.',
      'Cache Friendly: Contiguous array indexing maximizes CPU L1/L2 cache hits.',
    ],
    csApplications: [
      'Microcontrollers and embedded IoT devices with constrained RAM (e.g. 2KB).',
      'Real-time operating systems requiring deterministic memory footprints.',
      'Zero-allocation high-frequency trading engines.',
    ],
    keyFormula: 'Auxiliary Space S(n) = O(1) (Constant extra memory)',
    keyFormulaLabel: 'SPACE COMPLEXITY FORMULA',
    keyTakeaway: 'Linear search is exceptionally memory-efficient and operates entirely in place.',
    codeSnippets: {
      c: `// Uses only 1 integer stack variable 'i'
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) { // Space: O(1)
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      cpp: `// Constant auxiliary space: O(1)
int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) return (int)i;
    }
    return -1;
}`,
      java: `// No object allocations inside loop
public static int search(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      python: `# O(1) auxiliary space: loop index only
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'int i = 0;', explanation: 'Allocates a single 4-byte integer on the stack frame.' },
      { lineNum: '2', code: 'arr[i]', explanation: 'Reads existing memory directly via pointer arithmetic.' },
      { lineNum: '3', code: 'return i;', explanation: 'Returns primitive index without heap memory allocation.' },
    ],
  },

  // =========================================================================
  // MODULE 07: MULTI-LANGUAGE IMPLEMENTATIONS
  // =========================================================================
  {
    id: 'theory-07',
    number: '07',
    category: 'CODE IMPLEMENTATIONS',
    title: 'Multi-Language Implementations',
    subtitle: 'Standard Production Implementations in C, C++, Java & Python',
    readTime: '~5 min read',
    summary:
      'Complete, runnable implementations across 4 major programming languages with comprehensive explanations.',
    analogyTitle: 'Saying "Hello" in Multiple Languages',
    analogyContent:
      'Whether you say "Hello", "Bonjour", "Hola", or "Namaste", the greeting meaning is identical. Similarly, linear search expresses the exact same comparison loop across C, C++, Java, and Python.',
    coreTopics: [
      'C: Iterative loop with arrays and pointer sizes int linearSearch(int arr[], int n, int target).',
      'C++: Modern standard template implementation using std::vector<int> and size types.',
      'Java: Object-oriented static method with .length property and standard classes.',
      'Python: Pythonic function utilizing range(len(arr)) and 0-based list indexing.',
    ],
    csApplications: [
      'Standard library fallback searches in libc and runtimes.',
      'Cross-language polyglot microservice development.',
      'Systems programming in C and high-level scripting in Python.',
    ],
    keyFormula: 'Universal Pattern: ∀ Languages: Loop (0 → n-1) { if (elem == target) return index } return -1',
    keyFormulaLabel: 'CROSS-LANGUAGE CODE PATTERN',
    keyTakeaway: 'Regardless of syntax differences, the underlying loop and comparison invariant remain identical across all languages.',
    codeSnippets: {
      c: `#include <stdio.h>

// Standard C Linear Search
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // 0-based index
        }
    }
    return -1; // Element absent
}

int main() {
    int data[] = {12, 45, 78, 23, 56};
    int target = 23;
    int n = sizeof(data) / sizeof(data[0]);
    int result = linearSearch(data, n, target);
    printf("Found at index: %d\\n", result);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>

// Modern C++ Linear Search
int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1;
}

int main() {
    std::vector<int> data = {12, 45, 78, 23, 56};
    int result = linearSearch(data, 23);
    std::cout << "Found at index: " << result << std::endl;
    return 0;
}`,
      java: `public class LinearSearch {
    // Production Java Linear Search
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] data = {12, 45, 78, 23, 56};
        int result = search(data, 23);
        System.out.println("Found at index: " + result);
    }
}`,
      python: `# Pythonic Linear Search
def linear_search(arr: list, target: int) -> int:
    """Sequentially searches arr for target. Returns index or -1."""
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

if __name__ == "__main__":
    data = [12, 45, 78, 23, 56]
    result = linear_search(data, 23)
    print(f"Found at index: {result}")`,
    },
    codeExplanations: [
      { lineNum: 'C', code: 'sizeof(data) / sizeof(data[0])', explanation: 'Calculates array element count in C.' },
      { lineNum: 'C++', code: 'arr.size()', explanation: 'Queries std::vector element count safely.' },
      { lineNum: 'Java', code: 'arr.length', explanation: 'Reads the built-in length property of primitive arrays.' },
      { lineNum: 'Python', code: 'range(len(arr))', explanation: 'Generates index sequence from 0 to len(arr) - 1.' },
    ],
  },

  // =========================================================================
  // MODULE 08: ADVANTAGES OF LINEAR SEARCH
  // =========================================================================
  {
    id: 'theory-08',
    number: '08',
    category: 'ADVANTAGES',
    title: 'Advantages of Linear Search',
    subtitle: 'Simplicity, Zero-Sorting Requirement & Data Structure Versatility',
    readTime: '~3 min read',
    summary:
      'Highlights key engineering strengths of linear search.',
    analogyTitle: 'Using a Swiss Army Knife',
    analogyContent:
      'A Swiss Army Knife is simple, compact, and works on almost anything immediately without requiring power outlets or calibration.',
    advantages: [
      {
        title: 'No Pre-Sorting Required',
        description: 'Works directly on raw, unsorted, streaming, and dynamic data without any setup phase.',
        tag: 'ZERO OVERHEAD',
      },
      {
        title: 'Extreme Simplicity',
        description: 'Minimal lines of code, easy to implement and debug without complex edge-case bugs.',
        tag: 'EASY TO DEBUG',
      },
      {
        title: 'Universal Data Structure Support',
        description: 'Operates on arrays, singly linked lists, doubly linked lists, files, and streams.',
        tag: 'VERSATILE',
      },
      {
        title: 'Hardware Cache Efficiency',
        description: 'Sequential memory access maximizes CPU cache line prefetching on small datasets.',
        tag: 'CACHE FRIENDLY',
      },
    ],
    csApplications: [
      'Searching linked lists where binary search is impossible due to lack of O(1) random indexing.',
      'Small lookup tables (n < 50) where linear search out-speeds hash tables due to zero hashing overhead.',
      'One-time searches on unsorted database rows.',
    ],
    keyFormula: 'Advantages: Simplicity + Zero Pre-Sorting + O(1) Space + Cache Locality',
    keyFormulaLabel: 'CORE ENGINEERING STRENGTHS',
    keyTakeaway: 'Linear search has zero setup overhead and works on any collection format.',
    codeSnippets: {
      c: `// Works on ANY raw unsorted array immediately!
int rawData[] = {99, 14, 5, 203, 1};
int found = linearSearch(rawData, 5, 203);`,
      cpp: `// Works on linked lists as well as vectors!
// std::find in <algorithm> uses linear search
auto it = std::find(list.begin(), list.end(), target);`,
      java: `// No sorting prerequisite needed
int[] unsorted = {42, 7, 19, 88, 3};
int idx = LinearSearch.search(unsorted, 19);`,
      python: `# Python's 'in' and 'list.index()' use linear search internally
nums = [50, 20, 10, 80, 40]
pos = linear_search(nums, 80)`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'Zero Setup', explanation: 'No need to call sort() or build auxiliary trees.' },
      { lineNum: '2', code: 'Linked Lists', explanation: 'Traverses nodes using curr = curr.next gracefully.' },
      { lineNum: '3', code: 'Cache Line', explanation: 'Loads adjacent elements into high-speed L1 cache.' },
    ],
  },

  // =========================================================================
  // MODULE 09: DISADVANTAGES & LIMITATIONS
  // =========================================================================
  {
    id: 'theory-09',
    number: '09',
    category: 'LIMITATIONS',
    title: 'Disadvantages & Limitations',
    subtitle: 'O(n) Scaling Penalties on Large Datasets',
    readTime: '~3 min read',
    summary:
      'Discusses when Linear Search becomes a bottleneck.',
    analogyTitle: 'Reading the Entire Phonebook for One Name',
    analogyContent:
      'Imagine reading every single name from page 1 of the New York phonebook to find "Zuckerberg". It would take weeks, whereas an indexed/sorted lookup takes 2 seconds.',
    disadvantages: [
      {
        title: 'Poor Scalability',
        description: 'On 10,000,000 items, worst case requires 10 million comparisons (whereas Binary Search requires ~24 comparisons).',
        impact: 'CRITICAL LATENCY ON BIG DATA',
      },
      {
        title: 'CPU Inefficiency for Frequent Lookups',
        description: 'Inefficient when millions of repeated queries run on the same dataset.',
        impact: 'WASTED CPU CYCLES',
      },
      {
        title: 'Not Practical for Big Data',
        description: 'Databases and search engines avoid linear scans in favor of B-Trees and Hash Tables.',
        impact: 'ARCHITECTURAL BOTTLENECK',
      },
    ],
    csApplications: [
      'Table full scans (seq scans) in SQL databases causing slow query alerts.',
      'High-throughput web servers dropping requests due to O(n) search bottlenecks.',
      'Graph search algorithms timing out on large vertex sets.',
    ],
    keyFormula: 'Scaling Comparison: n = 10,000,000 ⇒ Linear: 10,000,000 steps vs Binary: 24 steps',
    keyFormulaLabel: 'SCALING BOTTLENECK FORMULA',
    keyTakeaway: 'Linear search degrades in performance as dataset size n reaches millions of records.',
    codeSnippets: {
      c: `// CAUTION: On large n, linear search causes high latency
// For n = 10,000,000:
// Linear Search = ~10,000,000 ops
// Binary Search = ~24 ops (if sorted)`,
      cpp: `// When frequent queries occur, sort first or use std::unordered_map
// std::unordered_map provides O(1) average lookup`,
      java: `// For large datasets with frequent queries:
// Use HashMap<K, V> or TreeMap<K, V> instead of linear array scans`,
      python: `# For large collections:
# Set lookup: O(1) average
# List linear search: O(n) time`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'O(n) Growth', explanation: 'Doubling the data size exactly doubles execution time.' },
      { lineNum: '2', code: 'Big Data Penalty', explanation: 'Unsuitable for tables with millions of rows.' },
      { lineNum: '3', code: 'Frequent Queries', explanation: 'Repeated O(n) searches quickly exhaust CPU resources.' },
    ],
  },

  // =========================================================================
  // MODULE 10: WHEN TO USE LINEAR SEARCH
  // =========================================================================
  {
    id: 'theory-10',
    number: '10',
    category: 'DECISION CRITERIA',
    title: 'When to Use Linear Search',
    subtitle: 'Practical Decision Criteria & Engineering Guidelines',
    readTime: '~3 min read',
    summary:
      'Practical rules of thumb for choosing linear search in real-world software design.',
    analogyTitle: 'Choosing a Bicycle vs. an Airplane',
    analogyContent:
      'You would not book a commercial flight to travel 2 blocks to the grocery store—a bicycle is faster because it has zero boarding or runway delay. Similarly, linear search is best for small or one-time searches.',
    decisionCriteria: [
      {
        scenario: 'Array size is small (n ≤ 50 to 100 items)',
        recommendation: 'Use Linear Search',
        rationale: 'Cache prefetching and zero sorting overhead make linear search faster than complex algorithms on small arrays.',
      },
      {
        scenario: 'Data is unsorted and searched only once',
        recommendation: 'Use Linear Search',
        rationale: 'Sorting first takes O(n log n), which is much slower than performing a single O(n) direct linear search.',
      },
      {
        scenario: 'Searching a Singly or Doubly Linked List',
        recommendation: 'Use Linear Search',
        rationale: 'Linked lists do not support O(1) random index access required for Binary Search.',
      },
      {
        scenario: 'Continuous live data streams',
        recommendation: 'Use Linear Search',
        rationale: 'Items arrive dynamically in real time and cannot be pre-sorted continuously.',
      },
    ],
    csApplications: [
      'Micro-benchmarks and small configuration lookups.',
      'Small enum lookups and state machine transitions.',
      'Single-pass filtering of incoming network packets.',
    ],
    keyFormula: 'Decision Rule: If (n ≤ 100) or (Unsorted & 1-Time Query) ⇒ Linear Search is Optimal',
    keyFormulaLabel: 'ENGINEERING DECISION RULE',
    keyTakeaway: 'If you only search an unsorted dataset once, Linear Search is faster than sorting first.',
    codeSnippets: {
      c: `// Scenario: 1-Time Search on Unsorted Array
// Cost to Sort + Binary Search: O(n log n) + O(log n)
// Cost to Linear Search: O(n)
// ⇒ Linear Search is FASTER for single lookups!`,
      cpp: `// Small vector lookup (e.g. n = 12 settings items)
bool hasPermission(const std::vector<std::string>& perms, const std::string& target) {
    for (const auto& p : perms) {
        if (p == target) return true;
    }
    return false;
}`,
      java: `// Linked List Traversal
public static Node searchList(Node head, int target) {
    Node curr = head;
    while (curr != null) {
        if (curr.val == target) return curr;
        curr = curr.next;
    }
    return null;
}`,
      python: `# Stream / Generator processing
def find_in_stream(stream, target):
    for item in stream:
        if item == target:
            return item
    return None`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'Single Lookup', explanation: 'O(n) linear search beats O(n log n) sort + O(log n) search.' },
      { lineNum: '2', code: 'Linked Lists', explanation: 'Sequential node hopping is the only available traversal mode.' },
      { lineNum: '3', code: 'Streaming', explanation: 'Evaluates items in real-time as they stream in over the wire.' },
    ],
  },

  // =========================================================================
  // MODULE 11: REAL-WORLD APPLICATIONS & EDGE CASES
  // =========================================================================
  {
    id: 'theory-11',
    number: '11',
    category: 'EDGE CASES & APPLICATIONS',
    title: 'Real-World Applications & Edge Cases',
    subtitle: 'Duplicate Elements, Empty Collections, Single-Item Lookups & Practical Optimizations',
    readTime: '~4 min read',
    summary:
      'Production-level handling of duplicate keys, empty inputs, non-integer searches, and object models.',
    analogyTitle: 'Handling Corner Cases in a Vending Machine',
    analogyContent:
      'A vending machine must gracefully handle an empty coin slot, exact change, or duplicate coin insertions without crashing.',
    edgeCases: [
      {
        scenario: 'Empty Array (n = 0)',
        input: 'arr = [], target = 5',
        behavior: 'Loop condition 0 < 0 evaluates immediately to false.',
        output: 'Safely returns -1 without out-of-bounds error.',
      },
      {
        scenario: 'Single Element (n = 1)',
        input: 'arr = [9], target = 9',
        behavior: 'Exactly 1 comparison evaluated at index 0.',
        output: 'Returns 0 on match, or -1 on mismatch.',
      },
      {
        scenario: 'Duplicate Keys Present',
        input: 'arr = [4, 7, 4, 9, 4], target = 4',
        behavior: 'Standard linear search returns first occurrence (index 0).',
        output: 'Returns index 0 (or all indices [0, 2, 4] in multi-match variant).',
      },
      {
        scenario: 'Target Absent from Array',
        input: 'arr = [10, 20, 30], target = 99',
        behavior: 'Exhausts all elements from index 0 to n - 1.',
        output: 'Returns -1 as standard failure code.',
      },
    ],
    csApplications: [
      'Searching arrays of User structs by ID or email.',
      'Case-insensitive string search in student rosters.',
      'Locating department records in employee lists.',
    ],
    keyFormula: 'Edge Case Invariant: Correct behavior on n = 0, n = 1, duplicates, and absent keys',
    keyFormulaLabel: 'EDGE CASE RESILIENCE',
    keyTakeaway: 'Linear search gracefully handles edge cases, duplicates, and complex object structures.',
    codeSnippets: {
      c: `// Searching an array of Structs by ID
typedef struct {
    int id;
    char name[50];
} User;

int findUserById(User users[], int n, int targetId) {
    for (int i = 0; i < n; i++) {
        if (users[i].id == targetId) {
            return i; // Found user record
        }
    }
    return -1;
}`,
      cpp: `// Multi-match variant: Returns all matching indices
std::vector<int> findAllMatches(const std::vector<int>& arr, int target) {
    std::vector<int> matches;
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) {
            matches.push_back(static_cast<int>(i));
        }
    }
    return matches;
}`,
      java: `// Case-insensitive string search in list
public static int searchRoster(String[] roster, String targetName) {
    if (roster == null || roster.length == 0) return -1;
    for (int i = 0; i < roster.length; i++) {
        if (roster[i].equalsIgnoreCase(targetName)) {
            return i;
        }
    }
    return -1;
}`,
      python: `# Multi-criteria Object Search in Python
def find_user_by_email(users: list, email: str):
    for i, user in enumerate(users):
        if user.get("email") == email:
            return i, user
    return -1, None`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'Empty Check', explanation: 'Guards against null or length = 0 inputs cleanly.' },
      { lineNum: '2', code: 'Duplicates', explanation: 'Returns earliest index or collects all into a dynamic list.' },
      { lineNum: '3', code: 'Objects', explanation: 'Accesses struct fields (e.g. user.id) without algorithm modification.' },
    ],
  },

  // =========================================================================
  // MODULE 12: LINEAR SEARCH VS. BINARY SEARCH & SUMMARY
  // =========================================================================
  {
    id: 'theory-12',
    number: '12',
    category: 'COMPARISON & SYNTHESIS',
    title: 'Linear Search vs. Binary Search & Summary',
    subtitle: 'Choosing the Right Searching Algorithm, Sorting Tradeoffs & Complete Curriculum Synthesis',
    readTime: '~5 min read',
    summary:
      'A head-to-head comparison and final master synthesis of the entire linear search paradigm.',
    analogyTitle: 'Flipping Dictionary Pages vs. Flipping to the Middle',
    analogyContent:
      'Linear search reads every page from page 1 onwards. Binary search opens the exact middle of a sorted dictionary, eliminates half the book in one step, and repeats until the word is found.',
    comparisonMatrix: [
      {
        feature: 'Worst-Case Time Complexity',
        linearSearch: 'O(n) (Linear)',
        binarySearch: 'O(log n) (Logarithmic)',
      },
      {
        feature: 'Data Prerequisite',
        linearSearch: 'None (Unsorted, Random, Duplicates)',
        binarySearch: 'Strictly Sorted Array Required',
      },
      {
        feature: 'Compatible Data Structures',
        linearSearch: 'Arrays, Linked Lists, Streams, Files',
        binarySearch: 'Arrays (Requires O(1) random index access)',
      },
      {
        feature: 'Auxiliary Memory (Space)',
        linearSearch: 'O(1) Extra Memory',
        binarySearch: 'O(1) Iterative / O(log n) Recursive Stack',
      },
      {
        feature: 'Best Used For',
        linearSearch: 'Small or unsorted datasets, single searches',
        binarySearch: 'Large sorted datasets with frequent queries',
      },
    ],
    masterRulebook: [
      'Step 1: Check if data is sorted. If not, use Linear Search directly.',
      'Step 2: Traverse from index 0 with early termination on match.',
      'Step 3: Return -1 on loop exhaustion.',
    ],
    csApplications: [
      'Algorithm selection in compiler optimizations.',
      'Standard library routing: small collections use linear scan, large collections use binary/hash search.',
      'Core foundational interview questions on algorithmic tradeoffs.',
    ],
    keyFormula: 'Summary: Linear Search O(n) (Zero Prep) vs Binary Search O(log n) (Sorted Only)',
    keyFormulaLabel: 'HEAD-TO-HEAD TRADE-OFF FORMULA',
    keyTakeaway: 'Linear Search is the zero-overhead foundational searching algorithm in computer science.',
    codeSnippets: {
      c: `// SUMMARY MATRIX
// Linear Search: Simple, works on any unsorted data, O(n)
// Binary Search: Requires sorted array, O(log n)
int linearSearch(int arr[], int n, int target);`,
      cpp: `// std::find -> Linear Search (O(n))
// std::binary_search / std::lower_bound -> Binary Search (O(log n))`,
      java: `// Arrays.binarySearch(arr, key) requires sorted array
// Linear search works on any collection immediately`,
      python: `# Python 'in' operator on lists: O(n) linear scan
# bisect module: O(log n) binary search on sorted lists`,
    },
    codeExplanations: [
      { lineNum: '1', code: 'Rule 1: Unsorted', explanation: 'If data is not sorted, linear search is immediate and optimal.' },
      { lineNum: '2', code: 'Rule 2: Small n', explanation: 'For small collections (n <= 50), linear search avoids setup overhead.' },
      { lineNum: '3', code: 'Rule 3: Mastery', explanation: 'Linear search forms the basis of all sequential data inspection.' },
    ],
  },
];
