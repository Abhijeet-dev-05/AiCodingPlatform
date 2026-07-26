import { Route, Routes,Navigate, StaticRouter } from 'react-router'
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { checkAuth } from './authSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import AdminPanel from './components/AdminPannel';
import Admin from './pages/Admin';
import AdminDelete from './components/AdminDelete';
import AdminUpdate from './components/AdminUpdate';
import RoadmapGenerator from './pages/RoadmapGenerator';
import CareerGuidance from './pages/CareerGuidance';
import AIInterview from './pages/AIInterview';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import SpacedRepetition from './pages/SpacedRepetition';

// Visualizer imports
import VisualizerHome from './visualizer/pages/VisualizerHome';
import SortingCategory from './visualizer/pages/SortingCategory';
import BubbleSortViz from './visualizer/components/sorting/BubbleSortViz';
import QuickSortViz from './visualizer/components/sorting/QuickSortViz';
import SelectionSortViz from './visualizer/components/sorting/SelectionSortViz';
import InsertionSortViz from './visualizer/components/sorting/InsertionSortViz';
import MergeSortViz from './visualizer/components/sorting/MergeSortViz';
import HeapSortViz from './visualizer/components/sorting/HeapSortViz';
// Stacks & Queues imports
import StacksQueuesCategory from './visualizer/pages/StacksQueuesCategory';
import StackViz from './visualizer/components/stacks-queues/StackViz';
import QueueViz from './visualizer/components/stacks-queues/QueueViz';
// Trees imports
import TreesCategory from './visualizer/pages/TreesCategory';
import BinaryTreeBFS from './visualizer/components/trees/BinaryTreeBFS';
// Graphs imports
import GraphsCategory from './visualizer/pages/GraphsCategory';
import GraphBFS from './visualizer/components/graphs/GraphBFS';
// Dynamic Programming imports
import DynamicProgrammingCategory from './visualizer/pages/DynamicProgrammingCategory';
import KnapsackViz from './visualizer/components/dp/KnapsackViz';
import LCSViz from './visualizer/components/dp/LCSViz';
import LISViz from './visualizer/components/dp/LISViz';
import CoinChangeViz from './visualizer/components/dp/CoinChangeViz';
import EditDistanceViz from './visualizer/components/dp/EditDistanceViz';
// Searching imports
import SearchingCategory from './visualizer/pages/SearchingCategory';
import BinarySearchViz from './visualizer/components/searching/BinarySearchViz';
import LinearSearchViz from './visualizer/components/searching/LinearSearchViz';
// Strings imports
import StringsCategory from './visualizer/pages/StringsCategory';
import SlidingWindowViz from './visualizer/components/strings/SlidingWindowViz';
import TwoPointersViz from './visualizer/components/strings/TwoPointersViz';
import KMPViz from './visualizer/components/strings/KMPViz';
import RabinKarpViz from './visualizer/components/strings/RabinKarpViz';
import ZAlgorithmViz from './visualizer/components/strings/ZAlgorithmViz';
import ManacherViz from './visualizer/components/strings/ManacherViz';
// Recursion imports
import RecursionCategory from './visualizer/pages/RecursionCategory';
import NQueensViz from './visualizer/components/recursion/NQueensViz';
import RatMazeViz from './visualizer/components/recursion/RatMazeViz';
import SudokuViz from './visualizer/components/recursion/SudokuViz';
import RecursionTreeViz from './visualizer/components/recursion/RecursionTreeViz';
import ProblemPage from './pages/ProblemPage';
import AdminVideo from './components/AdminVideo';
import AdminUpload from './components/AdminUpload';

function App() {
  const {isAuthenticated,loading,user} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

   if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return (
    <Routes>
      <Route path="/" element={isAuthenticated?<HomePage />:<LandingPage />} />
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login />} />
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<SignUp />} />
      <Route path="/dashboard" element={isAuthenticated?<UserDashboard />:<Navigate to="/login" />} />
      <Route path='/admin' element={isAuthenticated && user.role === 'admin'?<Admin/>:<Navigate to="/" />} ></Route>
      <Route path='/admin/create' element={isAuthenticated && user.role === 'admin'?<AdminPanel />:<Navigate to="/" />} ></Route>
      <Route path='/admin/delete' element={isAuthenticated && user.role === 'admin'?<AdminDelete/>:<Navigate to="/" />} ></Route>
      <Route path='/admin/update' element={isAuthenticated && user.role === 'admin'?<AdminUpdate/>:<Navigate to="/" />} ></Route>
      <Route path='/admin/dashboard' element={isAuthenticated && user.role === 'admin'?<AdminDashboard/>:<Navigate to="/" />} ></Route>
      <Route path="/admin/video" element={isAuthenticated && user.role === 'admin'?<AdminVideo/>:<Navigate to="/" />} ></Route>
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user.role === 'admin'?<AdminUpload/>:<Navigate to="/" />} ></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      <Route path="/roadmap" element={isAuthenticated ? <RoadmapGenerator /> : <Navigate to="/login" />} />
      <Route path="/career" element={isAuthenticated ? <CareerGuidance /> : <Navigate to="/login" />} />
      <Route path="/ai-interview" element={isAuthenticated ? <AIInterview /> : <Navigate to="/login" />} />
      <Route path="/review" element={isAuthenticated ? <SpacedRepetition /> : <Navigate to="/login" />} />
      {/* Visualizer Routes - Protected for authenticated users */}
      <Route path="/visualizer" element={isAuthenticated ? <VisualizerHome /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting" element={isAuthenticated ? <SortingCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/bubble-sort" element={isAuthenticated ? <BubbleSortViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/quick-sort" element={isAuthenticated ? <QuickSortViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/selection-sort" element={isAuthenticated ? <SelectionSortViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/insertion-sort" element={isAuthenticated ? <InsertionSortViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/merge-sort" element={isAuthenticated ? <MergeSortViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/sorting/heap-sort" element={isAuthenticated ? <HeapSortViz /> : <Navigate to="/login" />} />
      {/* Stacks & Queues Routes */}
      <Route path="/visualizer/stacks-queues" element={isAuthenticated ? <StacksQueuesCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/stacks-queues/stack" element={isAuthenticated ? <StackViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/stacks-queues/queue" element={isAuthenticated ? <QueueViz /> : <Navigate to="/login" />} />
      {/* Trees Routes */}
      <Route path="/visualizer/trees" element={isAuthenticated ? <TreesCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/trees/binary-tree-bfs" element={isAuthenticated ? <BinaryTreeBFS /> : <Navigate to="/login" />} />
      {/* Graphs Routes */}
      <Route path="/visualizer/graphs" element={isAuthenticated ? <GraphsCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/graphs/graph-bfs" element={isAuthenticated ? <GraphBFS /> : <Navigate to="/login" />} />
      {/* Dynamic Programming Routes */}
      <Route path="/visualizer/dynamic-programming" element={isAuthenticated ? <DynamicProgrammingCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/dynamic-programming/knapsack" element={isAuthenticated ? <KnapsackViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/dynamic-programming/lcs" element={isAuthenticated ? <LCSViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/dynamic-programming/lis" element={isAuthenticated ? <LISViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/dynamic-programming/coin-change" element={isAuthenticated ? <CoinChangeViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/dynamic-programming/edit-distance" element={isAuthenticated ? <EditDistanceViz /> : <Navigate to="/login" />} />
      {/* Searching Routes */}
      <Route path="/visualizer/searching" element={isAuthenticated ? <SearchingCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/searching/binary-search" element={isAuthenticated ? <BinarySearchViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/searching/linear-search" element={isAuthenticated ? <LinearSearchViz /> : <Navigate to="/login" />} />
      {/* Strings Routes */}
      <Route path="/visualizer/strings" element={isAuthenticated ? <StringsCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/sliding-window" element={isAuthenticated ? <SlidingWindowViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/two-pointers" element={isAuthenticated ? <TwoPointersViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/kmp" element={isAuthenticated ? <KMPViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/rabin-karp" element={isAuthenticated ? <RabinKarpViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/z-algorithm" element={isAuthenticated ? <ZAlgorithmViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/strings/manacher" element={isAuthenticated ? <ManacherViz /> : <Navigate to="/login" />} />
      {/* Recursion Routes */}
      <Route path="/visualizer/recursion" element={isAuthenticated ? <RecursionCategory /> : <Navigate to="/login" />} />
      <Route path="/visualizer/recursion/recursion-tree" element={isAuthenticated ? <RecursionTreeViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/recursion/n-queens" element={isAuthenticated ? <NQueensViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/recursion/sudoku-solver" element={isAuthenticated ? <SudokuViz /> : <Navigate to="/login" />} />
      <Route path="/visualizer/recursion/rat-maze" element={isAuthenticated ? <RatMazeViz /> : <Navigate to="/login" />} />
      {/* <Route path="/admin" element={isAuthenticated && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} /> */}
    </Routes>
  )
}

export default App;
