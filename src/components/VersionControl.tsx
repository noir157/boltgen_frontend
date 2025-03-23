import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitPullRequest, Plus, Check, X, GitMerge, GitFork, Search, Filter } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  timestamp: string;
  changes: number;
  branch: string;
  author: string;
}

interface Branch {
  name: string;
  lastCommit: string;
  isProtected: boolean;
}

export const VersionControl: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>(() => {
    const saved = localStorage.getItem('version-control-commits');
    return saved ? JSON.parse(saved) : [
      {
        id: '8f4d2e1',
        message: 'Initial commit',
        timestamp: '2025-03-22 10:30',
        changes: 5,
        branch: 'main',
        author: 'System'
      }
    ];
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('version-control-branches');
    return saved ? JSON.parse(saved) : [
      { name: 'main', lastCommit: '8f4d2e1', isProtected: true },
      { name: 'develop', lastCommit: '8f4d2e1', isProtected: false }
    ];
  });

  const [newCommitMessage, setNewCommitMessage] = useState('');
  const [currentBranch, setCurrentBranch] = useState('main');
  const [showNewCommit, setShowNewCommit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [filter, setFilter] = useState<'all' | 'branch'>('all');

  useEffect(() => {
    localStorage.setItem('version-control-commits', JSON.stringify(commits));
    localStorage.setItem('version-control-branches', JSON.stringify(branches));
  }, [commits, branches]);

  const handleNewCommit = () => {
    if (newCommitMessage.trim()) {
      const newCommit: Commit = {
        id: Math.random().toString(36).substr(2, 7),
        message: newCommitMessage,
        timestamp: new Date().toLocaleString(),
        changes: Math.floor(Math.random() * 10) + 1,
        branch: currentBranch,
        author: 'Current User'
      };

      setCommits([newCommit, ...commits]);
      setBranches(branches.map(b => 
        b.name === currentBranch ? { ...b, lastCommit: newCommit.id } : b
      ));
      setNewCommitMessage('');
      setShowNewCommit(false);
    }
  };

  const handleCreateBranch = () => {
    if (newBranchName.trim() && !branches.some(b => b.name === newBranchName)) {
      const currentBranchData = branches.find(b => b.name === currentBranch);
      setBranches([...branches, {
        name: newBranchName,
        lastCommit: currentBranchData?.lastCommit || commits[0].id,
        isProtected: false
      }]);
      setNewBranchName('');
      setShowNewBranch(false);
      setCurrentBranch(newBranchName);
    }
  };

  const filteredCommits = commits
    .filter(commit => 
      (filter === 'all' || commit.branch === currentBranch) &&
      (commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
       commit.id.includes(searchTerm) ||
       commit.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GitBranch size={16} className="text-green-500" />
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
            >
              {branches.map(branch => (
                <option key={branch.name} value={branch.name}>
                  {branch.name} {branch.isProtected ? '(protected)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewBranch(true)}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="New Branch"
            >
              <GitFork size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowNewCommit(true)}
            className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            <Plus size={14} />
            <span>New Commit</span>
          </button>
        </div>

        {showNewBranch && (
          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="New branch name"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewBranch(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <button
                onClick={handleCreateBranch}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <Check size={16} className="text-green-500" />
              </button>
            </div>
          </div>
        )}

        {showNewCommit && (
          <div className="space-y-2">
            <input
              type="text"
              value={newCommitMessage}
              onChange={(e) => setNewCommitMessage(e.target.value)}
              placeholder="Commit message"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewCommit(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <button
                onClick={handleNewCommit}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <Check size={16} className="text-green-500" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 mt-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commits..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'branch')}
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm"
          >
            <option value="all">All Branches</option>
            <option value="branch">Current Branch</option>
          </select>
        </div>
      </div>

      {/* Commit History */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {filteredCommits.map((commit) => (
            <div
              key={commit.id}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <GitCommit size={16} className="text-blue-500" />
                  <span className="text-sm font-mono text-gray-500">{commit.id}</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {commit.branch}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{commit.timestamp}</span>
              </div>
              <p className="mt-2 text-sm">{commit.message}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{commit.changes} files changed</span>
                <span>by {commit.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <GitPullRequest size={14} />
          <span>No pull requests</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{commits.length} commits</span>
          <span>{branches.length} branches</span>
        </div>
      </div>
    </div>
  );
};