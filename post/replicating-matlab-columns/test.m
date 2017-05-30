function test()
  P = [42 -1 101];
  reps = [2 1 5];

  % Check to make sure all implementations work on simple example
  checker = @(a, b) all(a(:) == b(:));
  gold = stupidSimple(P, reps)
  assert(checker(gold, initialAttempt(P, reps)))
  assert(checker(gold, sparseSumZeroBad(P, reps)))
  assert(checker(gold, sparseSum(P, reps)))

  % Check speed
  P = rand(10, 1e3);
  reps = randi([0, 39], 1, size(P, 2));
  cellfun(@(f) timeit(@() f(P, reps)), {@stupidSimple, @initialAttempt, @sparseSumZeroBad, @sparseSum})
end

function M = stupidSimple(P, reps)
  M = [];
  for colIdx = 1 : length(reps)
    M = [M repmat(P(:, colIdx), 1, reps(colIdx))];
  end
end

function M = initialAttempt(P, reps)
  c = arrayfun(@(n, i) i*ones(n,1), reps, 1:length(reps), 'un', 0);
  i = cell2mat(c(:));
  M = P(:, i);
end

function M = sparseSumZeroBad(P, reps)
  widthM = sum(reps);
  % vector to be cumsummed
  z = zeros(widthM, 1);
  % indexes of z to be 1 (otherwise z is 0)
  j = [1 1 + cumsum(reps(1 : end - 1))]; % 🌶 pixie dust, not much
  z(j) = 1;
  % as promised, cumsum z to get i:
  i = cumsum(z);
  % use i to index into P:
  M = P(:, i);
end

function M = sparseSum(P,reps)
  nzidx = reps~=0;
  nzreps = reps(nzidx);

  % reps != 0 algorithm as above, except using nzreps instead of reps
  widthM = sum(reps);
  z = zeros(widthM, 1);
  j = [1 1 + cumsum(nzreps(1 : end - 1))]; % 🌶 pixie dust, not much
  z(j) = 1;
  i = cumsum(z);

  % adjust i
  n = 1:numel(reps);
  f = n(nzidx);
  i2 = f(i);

  M = P(:, i2);
end
