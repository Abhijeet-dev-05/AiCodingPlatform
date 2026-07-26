import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import '../pages/Admin.css';
import './AdminPanel.css';

// Relaxed schema for update - allows empty fields
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.string().min(1, 'Tag is required'),
  visibleTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional()
    })
  ).optional(),
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string()
    })
  ).optional(),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      initialCode: z.string()
    })
  ).optional(),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      completeCode: z.string()
    })
  ).optional()
});

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
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

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblems');
      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblem = async (problem) => {
    setError(null);
    setSuccess(null);

    try {
      // Fetch full problem details
      const { data } = await axiosClient.get(`/problem/problemById/${problem._id}`);
      const fullProblem = data.problem || data;

      setSelectedProblem(fullProblem);

      // Reset form with full problem data
      reset({
        title: fullProblem.title || '',
        description: fullProblem.description || '',
        difficulty: fullProblem.difficulty || 'easy',
        tags: fullProblem.tags || 'array',
        visibleTestCases: fullProblem.visibleTestCases?.length > 0
          ? fullProblem.visibleTestCases
          : [{ input: '', output: '', explanation: '' }],
        hiddenTestCases: fullProblem.hiddenTestCases?.length > 0
          ? fullProblem.hiddenTestCases
          : [{ input: '', output: '' }],
        startCode: fullProblem.startCode?.length === 3
          ? fullProblem.startCode
          : [
            { language: 'C++', initialCode: '' },
            { language: 'Java', initialCode: '' },
            { language: 'JavaScript', initialCode: '' },
            { language: 'Python', initialCode: '' }
          ],
        referenceSolution: fullProblem.referenceSolution?.length === 3
          ? fullProblem.referenceSolution
          : [
            { language: 'C++', completeCode: '' },
            { language: 'Java', completeCode: '' },
            { language: 'JavaScript', completeCode: '' }
          ]
      });
    } catch (err) {
      setError('Failed to fetch problem details');
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    try {
      const response = await axiosClient.put(`/problem/update/${selectedProblem._id}`, data);
      console.log('Update response:', response);
      setSuccess('Problem updated successfully!');
      setSelectedProblem(null);
      fetchProblems();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data || err.message || 'Failed to update problem');
    }
  };

  const getDifficultyClass = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'medium') return 'badge-medium';
    return 'badge-hard';
  };

  if (loading) {
    return (
      <div className="admin-table-page">
        <div className="admin-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // If a problem is selected, show the edit form
  if (selectedProblem) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <button onClick={() => setSelectedProblem(null)} className="admin-back-btn">
            ← Back to Problem List
          </button>

          <div className="admin-header">
            <div className="admin-badge"><span>✏️ Edit Problem</span></div>
            <h1 className="admin-title">Update: {selectedProblem.title}</h1>
          </div>

          {error && <div className="admin-error">{error}</div>}
          {success && <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '1rem', color: '#22c55e', marginBottom: '1rem' }}>{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information */}
            <div className="admin-card">
              <h2>Basic Information</h2>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input {...register('title')} placeholder="Problem title" className="form-input" />
                {errors.title && <span className="form-error">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea {...register('description')} placeholder="Problem description..." className="form-input form-textarea" />
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
                    {['array', 'linkedlist', 'graph', 'dp', 'string', 'sliding-window', 'two-pointers', 'hashing', 'stack', 'queue', 'tree', 'binary-tree', 'bst', 'heap', 'sorting', 'searching', 'binary-search'].map(tag => (
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
                    <button type="button" onClick={() => removeVisible(index)} className="btn-remove">Remove</button>
                  </div>
                  <div className="form-group">
                    <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="form-input" />
                  </div>
                  <div className="form-group">
                    <input {...register(`visibleTestCases.${index}.output`)} placeholder="Expected Output" className="form-input" />
                  </div>
                  <div className="form-group">
                    <input {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="form-input" />
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn-add">
                + Add Test Case
              </button>
            </div>

            {/* Hidden Test Cases */}
            <div className="admin-card">
              <h2>Hidden Test Cases</h2>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="testcase-item">
                  <div className="testcase-header">
                    <span className="testcase-title">Hidden Test {index + 1}</span>
                    <button type="button" onClick={() => removeHidden(index)} className="btn-remove">Remove</button>
                  </div>
                  <div className="form-group">
                    <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="form-input" />
                  </div>
                  <div className="form-group">
                    <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Expected Output" className="form-input" />
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn-add">
                + Add Hidden Test
              </button>
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
                    placeholder={`// ${lang} starter code...`}
                    className="form-input form-textarea code-textarea"
                  />
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
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Updating...' : '💾 Update Problem'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Problem selection list
  return (
    <div className="admin-table-page">
      <div className="admin-table-container">
        <NavLink to="/admin" className="admin-back-btn">← Back to Admin</NavLink>

        <div className="admin-table-header">
          <h1>✏️ Select Problem to Update</h1>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '1rem', color: '#22c55e', marginBottom: '1rem' }}>{success}</div>}

        {problems.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p>No problems found</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id}>
                    <td>{index + 1}</td>
                    <td>{problem.title}</td>
                    <td>
                      <span className={getDifficultyClass(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag">{problem.tags}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleSelectProblem(problem)}
                        className="btn-action edit"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpdate;
