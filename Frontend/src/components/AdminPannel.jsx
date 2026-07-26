import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, Link } from 'react-router';
import './AdminPanel.css';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum([
    'array', 'linkedlist', 'graph', 'dp', 'string', 'sliding-window',
    'two-pointers', 'hashing', 'stack', 'queue', 'tree', 'binary-tree',
    'bst', 'heap', 'priority-queue', 'trie', 'greedy', 'backtracking',
    'recursion', 'bit-manipulation', 'math', 'sorting', 'searching',
    'binary-search', 'prefix-sum', 'graph-bfs', 'graph-dfs', 'shortest-path',
    'dijkstra', 'topo-sort', 'union-find', 'knapsack', 'lcs', 'lis', 'matrix-dp'
  ]),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(4, 'All four languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(4, 'All four languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: 'array',
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' },
        { language: 'Python', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' },
        { language: 'Python', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Back Button */}
        <Link to="/admin" className="btn-back">← Back to Admin</Link>

        {/* Header */}
        <div className="admin-header">
          <div className="admin-badge">
            <span>✦ Admin Panel ✦</span>
          </div>
          <h1 className="admin-title">Create New Problem</h1>
          <p className="admin-subtitle">Add a new coding challenge for developers</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <div className="admin-card">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                {...register('title')}
                placeholder="e.g., Two Sum"
                className="form-input"
              />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                placeholder="Write a detailed problem description..."
                className="form-input form-textarea"
              />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select {...register('difficulty')} className="form-input form-select">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tag</label>
                <select {...register('tags')} className="form-input form-select">
                  {['array', 'linkedlist', 'graph', 'dp', 'string', 'sliding-window',
                    'two-pointers', 'hashing', 'stack', 'queue', 'tree', 'binary-tree',
                    'bst', 'heap', 'priority-queue', 'trie', 'greedy', 'backtracking',
                    'recursion', 'bit-manipulation', 'math', 'sorting', 'searching',
                    'binary-search'].map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visible Test Cases */}
          <div className="admin-card">
            <h2>Visible Test Cases</h2>

            {visibleFields.map((field, index) => (
              <div key={field.id} className="testcase-item">
                <div className="testcase-header">
                  <span className="testcase-title">Test Case {index + 1}</span>
                  <button type="button" onClick={() => removeVisible(index)} className="btn-remove">
                    Remove
                  </button>
                </div>
                <div className="form-group">
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Expected Output"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="form-input"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
              className="btn-add"
            >
              + Add Test Case
            </button>
            {errors.visibleTestCases && (
              <span className="form-error">{errors.visibleTestCases.message}</span>
            )}
          </div>

          {/* Hidden Test Cases */}
          <div className="admin-card">
            <h2>Hidden Test Cases</h2>

            {hiddenFields.map((field, index) => (
              <div key={field.id} className="testcase-item">
                <div className="testcase-header">
                  <span className="testcase-title">Hidden Test {index + 1}</span>
                  <button type="button" onClick={() => removeHidden(index)} className="btn-remove">
                    Remove
                  </button>
                </div>
                <div className="form-group">
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Expected Output"
                    className="form-input"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendHidden({ input: '', output: '' })}
              className="btn-add"
            >
              + Add Hidden Test
            </button>
            {errors.hiddenTestCases && (
              <span className="form-error">{errors.hiddenTestCases.message}</span>
            )}
          </div>

          {/* Starter Code */}
          <div className="admin-card">
            <h2>Starter Code Templates</h2>

            {['C++', 'Java', 'JavaScript'].map((lang, index) => (
              <div key={lang} className="code-section">
                <div className="code-label">
                  {lang === 'C++' ? '🔷' : lang === 'Java' ? '☕' : '🟨'} {lang}
                </div>
                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  placeholder={`// ${lang} starter code template...`}
                  className="form-input form-textarea code-textarea"
                />
                {errors.startCode?.[index]?.initialCode && (
                  <span className="form-error">{errors.startCode[index].initialCode.message}</span>
                )}
              </div>
            ))}
          </div>

          {/* Reference Solutions */}
          <div className="admin-card">
            <h2>Reference Solutions</h2>

            {['C++', 'Java', 'JavaScript'].map((lang, index) => (
              <div key={lang} className="code-section">
                <div className="code-label">
                  {lang === 'C++' ? '🔷' : lang === 'Java' ? '☕' : '🟨'} {lang}
                </div>
                <textarea
                  {...register(`referenceSolution.${index}.completeCode`)}
                  placeholder={`// ${lang} complete solution...`}
                  className="form-input form-textarea code-textarea"
                />
                {errors.referenceSolution?.[index]?.completeCode && (
                  <span className="form-error">{errors.referenceSolution[index].completeCode.message}</span>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? '⏳ Creating...' : '🚀 Create Problem'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;