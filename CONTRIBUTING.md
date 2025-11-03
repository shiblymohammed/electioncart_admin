# Contributing to Election Cart Admin Panel

## Development Workflow

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd election-cart-admin
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow the existing code style
- Write clean, readable code
- Test your changes thoroughly

### 4. Commit

```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design

### File Structure
- Place components in `src/components/`
- Place pages in `src/pages/`
- Place services in `src/services/`
- Place types in `src/types/`

## Testing

Before submitting:

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build
```

## Questions?

Open an issue for discussion before starting major changes.
