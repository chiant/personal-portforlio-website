#!/bin/bash

# Update import paths for profile components
find src/pages/profile/components -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../../types'\''|g' {} \;
find src/pages/profile/components -name "*.tsx" -exec sed -i '' 's|from '\''../../types'\''|from '\''../../../types'\''|g' {} \;
find src/pages/profile/components -name "*.tsx" -exec sed -i '' 's|from '\''../services'\''|from '\''../../../services'\''|g' {} \;
find src/pages/profile/components -name "*.tsx" -exec sed -i '' 's|from '\''../../services'\''|from '\''../../../services'\''|g' {} \;

# Update import paths for profile shared components
find src/pages/profile/shared -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../../types'\''|g' {} \;
find src/pages/profile/shared -name "*.tsx" -exec sed -i '' 's|from '\''../../types'\''|from '\''../../../types'\''|g' {} \;

# Update import paths for management components
find src/pages/management/components -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../../types'\''|g' {} \;
find src/pages/management/components -name "*.tsx" -exec sed -i '' 's|from '\''../../types'\''|from '\''../../../types'\''|g' {} \;
find src/pages/management/components -name "*.tsx" -exec sed -i '' 's|from '\''../services'\''|from '\''../../../services'\''|g' {} \;
find src/pages/management/components -name "*.tsx" -exec sed -i '' 's|from '\''../../services'\''|from '\''../../../services'\''|g' {} \;

# Update import paths for management editors
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../../../types'\''|g' {} \;
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../../types'\''|from '\''../../../../types'\''|g' {} \;
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../../../types'\''|from '\''../../../../types'\''|g' {} \;
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../services'\''|from '\''../../../../services'\''|g' {} \;
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../../services'\''|from '\''../../../../services'\''|g' {} \;
find src/pages/management/components/editors -name "*.tsx" -exec sed -i '' 's|from '\''../../../services'\''|from '\''../../../../services'\''|g' {} \;

# Update import paths for management page
find src/pages/management -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../types'\''|g' {} \;
find src/pages/management -name "*.tsx" -exec sed -i '' 's|from '\''../services'\''|from '\''../../services'\''|g' {} \;

# Update import paths for profile page
find src/pages/profile -name "*.tsx" -exec sed -i '' 's|from '\''../types'\''|from '\''../../types'\''|g' {} \;
find src/pages/profile -name "*.tsx" -exec sed -i '' 's|from '\''../services'\''|from '\''../../services'\''|g' {} \;

echo "Import paths updated successfully!"
