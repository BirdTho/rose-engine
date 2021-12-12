
import {Vector3, CurvePath, Matrix4, MathUtils} from "three";

/**
 * @this {CurvePath<Vector3>}
 */
export default function moddedComputeFrenetFrames(segments: number, closed: boolean = false) {

  // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

  const normal = new Vector3();

  const tangents = [];
  const normals = [];
  const binormals = [];

  const vec = new Vector3();
  const mat = new Matrix4();

  // compute the tangent vectors for each segment on the curve

  for ( let i = 0; i <= segments; i ++ ) {

    const u = i / segments;

    // @ts-ignore
    const vec3 = this.getTangentAt( u, new Vector3() );
    vec3.z = 0;
    vec3.normalize();
    tangents[ i ] = vec3;
  }

  // select an initial normal vector perpendicular to the first tangent vector,
  // and in the direction of the minimum tangent xyz component

  normals[ 0 ] = new Vector3();
  binormals[ 0 ] = new Vector3();
  let min = Number.MAX_VALUE;
  const tx = Math.abs( tangents[ 0 ].x );
  const ty = Math.abs( tangents[ 0 ].y );
  const tz = Math.abs( tangents[ 0 ].z );

  if ( tx <= min ) {

    min = tx;
    normal.set( 1, 0, 0 );

  }

  if ( ty <= min ) {

    min = ty;
    normal.set( 0, 1, 0 );

  }

  if ( tz <= min ) {

    normal.set( 0, 0, 1 );

  }

  vec.crossVectors( tangents[ 0 ], normal ).normalize();

  normals[ 0 ].crossVectors( tangents[ 0 ], vec );
  binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );


  // compute the slowly-varying normal and binormal vectors for each segment on the curve

  for ( let i = 1; i <= segments; i ++ ) {

    normals[ i ] = normals[ i - 1 ].clone();

    binormals[ i ] = binormals[ i - 1 ].clone();

    vec.crossVectors( tangents[ i - 1 ], tangents[ i ] );

    if ( vec.length() > Number.EPSILON ) {

      vec.normalize();

      const theta = Math.acos( MathUtils.clamp( tangents[ i - 1 ].dot( tangents[ i ] ), - 1, 1 ) ); // clamp for floating pt errors

      normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

    }

    binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

  }

  // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

  if ( true ) {

    let theta = Math.acos( MathUtils.clamp( normals[ 0 ].dot( normals[ segments ] ), - 1, 1 ) );
    theta /= segments;

    if ( tangents[ 0 ].dot( vec.crossVectors( normals[ 0 ], normals[ segments ] ) ) > 0 ) {

      theta = - theta;

    }

    for ( let i = 1; i <= segments; i ++ ) {

      // twist a little...
      normals[ i ].applyMatrix4( mat.makeRotationAxis( tangents[ i ], theta * i ) );
      binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

    }

  }

  return {
    tangents: tangents,
    normals: normals,
    binormals: binormals
  };

}